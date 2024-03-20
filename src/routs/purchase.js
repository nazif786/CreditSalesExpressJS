const express = require('express');
const myconn = require('../db/conn');
const routs = express.Router();
const purchase_routs = express()
const { body, validationResult } = require('express-validator');
const { urlencoded } = require('body-parser');
const authController = require('./auth')

let companyData = [];
let transactionTypeData = [];
let companyData2 = [];
let transactionTypeData2 = [];
let purchaseDataSearch = [];
let purchaseDataSearch2 = [];
// function myfun(x, y) {
//     // console.log(x)
//     // console.log(y)
// }
// myfun(companyData, transactionTypeData)

// --------------- new Purchase -----------------------------------------------------------
// first load company and transaction data from database 
purchase_routs.post('/api/loadCompanyData', authController.isloggedIn, (req, res) => {

    myconn.query(`SELECT * FROM employeedb.company;
    SELECT * FROM employeedb.transaction_type;
    `, [1, 2], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', {
                msg: true,
                company_data: result[0],
                tran_data: result[1],
                user: req.user
            });
            // companyData = result[0]; 
            // transactionTypeData = [1];
            // console.log(companyData)
        } else {
            res.render('newPurchase', {});
            console.log("some error")
        }
    });
});
// secomd: Selct specific company (suppplier)
purchase_routs.post('/api/loadCompData', authController.isloggedIn, (req, res) => {
    let comp_name = req.body.c_name;
    let q = `select * from company where comp_name=?;`
    myconn.query(q, [comp_name], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', { msg2: true, dataComp: result });
            companyData = result[0];
            // console.log(companyData)
        } else {
            res.render('')
        }
    });
});
// third: selct specific transaction type
purchase_routs.post('/api/loadTTypeData', authController.isloggedIn, (req, res) => {
    let trans_type = req.body.t_type;
    let q = `SELECT * FROM employeedb.transaction_type where type_name=?;`
    myconn.query(q, [trans_type], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', { msg2: true, datatrans: result });
            transactionTypeData = result[0];
            // console.log(transactionTypeData)
        } else {
            res.render('')
        }
    });
});
// forth: lastly add purchase data to database
purchase_routs.post('/api/addPurchase', authController.isloggedIn,
    [
    // body('comp_id').not().isEmpty().withMessage('please Select Company Name'),
    // body('type_id').not().isEmpty().withMessage('Please Select Transaction Type'),
    body('reciept_no').not().isEmpty().trim().escape().withMessage('Receipt Number can not be empty'),
    body('reciept_no').isNumeric().withMessage('Receipt Number can not contain alphabets or special charactors'),

    body('p_amount').not().isEmpty().trim().escape().withMessage('Purchase Amount can not be empty'),
    body('p_amount').isInt({ min: 0 }).withMessage('Purchase Amount must be currency with value of zero or more'),

    body('p_payment').not().isEmpty().trim().escape().withMessage('payment can not be empty'),
    body('p_payment').isInt({ min: 0 }).withMessage('payment must be currency with value zero or more'),

    body('p_com').isFloat().default('0').withMessage('Commission percentage can only be number with specific range (can not be negative or more then specific company policy)'),

    // body('id').not().isEmpty().withMessage('Please Select Company'),
    // body('type_id').not().isEmpty().withMessage('Please Select Transactin type'),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newPurchase', { alerts });
    }
    else {
        console.log(companyData)
        console.log(transactionTypeData)
        user_id = req.user.user_id
        
        if ((companyData.length==0) || (transactionTypeData.length==0)){
            res.render('api/newPurchase', {alr:'Please select company and transaction type'})
        }else{
            let comp_id = companyData.comp_id;
            let id = companyData.comp_id;
            let type_id = transactionTypeData.type_id;
            //let comp_id = companyData[0].comp_id;

            console.log('here')
            // console.log(type_id)
            
            let { p_amount, p_payment, p_com, reciept_no, remarks } = req.body; 
            let qu = `SELECt p_reciept_no from purchases WHERE p_reciept_no=?`
            myconn.query(qu, [reciept_no], (err, r) => {
                if (err) throw err
                else {
                    if (r.length > 0) {
                        res.render('api/newPurchase', { recpt_ex_err: true, user:req.user });
                    }
                    else {
                        let q = `INSERT INTO purchases 
                        (comp_id, user_id, trans_type_id, p_amount, p_payment, p_com, p_reciept_no,  remarks) 
                        VALUES (?,?,?,?,?,?,?,?)`;
                        myconn.query(q,
                            [id, user_id, type_id, p_amount, p_payment, p_com, reciept_no, remarks], (err, results) => {
                                if (err) throw err
                                else {
                                    myconn.query('SELECT * from employeedb.purchases ORDER BY p_id DESC LIMIT 1', (err, resl) => {
                                        if (err) throw err
                                        else {
                                            res.redirect('pictureUpload');
                                            // console.log(resl) saleData: resl,
                                        }
                                    })
                                }
                            });
                    }
                }
            })
        }
    }
});


// --------------- update Purchase Data ----------------------------------
// first search the purchase data using purchase id or reciept no
purchase_routs.post('/api/purchaseUpdateSearch', authController.isloggedIn, [
    body('pUSearchkey').not().isEmpty().trim().escape().withMessage('please enter purchase ID or reciept no.')
], (req, res) => {
    let pUSearchkey = req.body.pUSearchkey;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('api/newPurchase', { alert });
    } else {
        myconn.query(`SELECT p_id,
    company.comp_name as comp_name, 
    transaction_type.type_name as type_name,
    company.comp_id,
    transaction_type.type_id,
    purchases.p_amount, 
    purchases.p_payment, 
    purchases.p_com, 
    purchases.p_reciept_no,  
    purchases.remarks from employeedb.purchases
    JOIN employeedb.company 
    ON purchases.comp_id = company.comp_id
    JOIN employeedb.transaction_type 
    ON purchases.trans_type_id =transaction_type.type_id
            WHERE p_id=? OR
            p_reciept_no=? 
            `,
            [pUSearchkey, pUSearchkey], (err, result) => {
                if (err) throw err
                else if (result.length > 0) {
                    res.render('api/newPurchase', {
                        pUdata: result,
                        hid: false,
                        user: req.user,
                        
                    })
                    purchaseDataSearch = result[0];
                    purchaseDataSearch2 = result;
                    
                } else {
                    res.render('api/newPurchase', {newP:true, errmsg_pu: true, user: req.user })
                }
            })
    }

});
// second:load company and transaction data from database
purchase_routs.post('/api/loadCompanyDataUPdate', authController.isloggedIn, (req, res) => {
    myconn.query(`SELECT * FROM employeedb.company;
    SELECT * FROM employeedb.transaction_type;
    `, [1, 2], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', {
                toupdate: purchaseDataSearch,
                cData_update: result[0],
                tData_update: result[1],
                compNtrans: true,
                user: req.user
            });
            // companyData = result[0]; 
            // transactionTypeData = [1];
            // console.log(companyData)
        } else {
            res.render('newPurchase', {});
            console.log("some error")
        }
    });
});
// / third: Selct specific company (suppplier)
purchase_routs.post('/api/nameCompData', authController.isloggedIn, (req, res) => {
    let namecomp = req.body.namecomp;
    // console.log(namecomp); 
    let q = `select * from company where comp_name=?;`
    myconn.query(q, [namecomp], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', { msg2: true, dataComp: result, user: req.user });
            companyData2 = result 
            // console.log(companyData2)
        } else {
            res.render('')
        }
    });
});
// forth: selct specific transaction type
purchase_routs.post('/api/typeTransData', authController.isloggedIn, (req, res) => {
    let typetrans = req.body.typetrans;
    // console.log(typetrans)
    let q = `SELECT * FROM employeedb.transaction_type where type_name=?;`
    myconn.query(q, [typetrans], (err, result) => {
        if (err) throw err.message
        else if (result.length > 0) {
            res.render('api/newPurchase', { msg2: true, datatrans: result, user: req.user });
            transactionTypeData2 = result
            // console.log(transactionTypeData2) 
        } else {
            res.render('')
        }
    });
});
// fifth: lastly grab new data and update the purchase data and submit to database 
purchase_routs.post('/api/companyDataUPdate', authController.isloggedIn,
    [
    // body('comp_id').not().isEmpty().trim().escape().withMessage('please Select Company Name'),
    // body('type_id').not().isEmpty().trim().escape().withMessage('Please Select Transaction Type'),

    body('reciept_no').not().isEmpty().trim().escape().withMessage('Receipt Number can not be empty'),
    body('reciept_no').isNumeric().withMessage('Receipt Number can not contain alphabets or special charactors'),

    body('p_amount').not().isEmpty().trim().escape().withMessage('Purchase Amount can not be empty'),
    body('p_amount').isInt({ min: 0 }).withMessage('Purchase Amount must be currency with value of zero or more'),

    body('p_payment').not().isEmpty().trim().escape().withMessage('payment can not be empty'),
    body('p_payment').isInt({ min: 0 }).withMessage('payment must be currency with value zero or more'),

    body('p_com').not().isEmpty().escape().withMessage('Please enter commission percentage'),
    body('p_com').isInt({ min: 0, max: 50 }).withMessage('Commission percentage can only be number with specific range (can not be negative or more then specific company policy)'),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newPurchase', { alerts });
    } else{
        if (purchaseDataSearch2.length==0) {
            res.render('',{alr:'Purchase data not updated!'})
        } else {
             // default data missing 

            // new data by select option 
            // let compp_id = companyData2.comp_id;
            // let typee_id = transactionTypeData2.type_id;

            let compp_id = [];
            let typee_id = [];
            // console.log(companyData2)
            // console.log(transactionTypeData2)
            if (companyData2.length==0){
                compp_id = purchaseDataSearch2[0].comp_id
                console.log('default')
            }else{
                compp_id = companyData2[0].comp_id
                console.log('update')
            }
            
            if (transactionTypeData2.length==0) {
                typee_id = purchaseDataSearch2[0].type_id
                console.log('default')
            }else {
                typee_id = transactionTypeData2[0].type_id
                console.log('update')
            }
        // console.log(compp_id)
        // console.log(typee_id)

            let { p_id, p_amount, p_payment, p_com, reciept_no, remarks } = req.body;
            myconn.query(`UPDATE purchases SET comp_id=?, trans_type_id=?, p_amount=?, p_payment=?, p_reciept_no=?, p_com=?, remarks=?
            WHERE p_id=?;
        `, [compp_id, typee_id, p_amount, p_payment, reciept_no, p_com, remarks, p_id], (err, result) => {
                if (err) throw err
                else {
                    res.render('api/newPurchase', { dataUpdate: true, user: req.user })
                    //console.log(result)
                }
                // }else{
                //     res.render('api/newPurchase', {dataUpdateError:true})
                // }
            })
    }
        }
       

});

/////////////////// deleting purchase record
// searching to delete 
purchase_routs.post('/api/searchPurchaseRecordDelete', authController.isloggedIn, [
    body('pDSearchkey').not().isEmpty().trim().escape().withMessage('Please Enter Valid Purchase ID or Receipt No!')
], (req, res) => {
    let pDSearchkey = req.body.pDSearchkey;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newPurchase', { alerts });
    } else {
        let sqlQ = `SELECT p_id,
            company.comp_name as comp_name, 
            transaction_type.type_name as type_name,
            purchases.p_amount, 
            purchases.p_payment, 
            purchases.p_com, 
            purchases.p_reciept_no,  
            purchases.remarks from employeedb.purchases
            JOIN employeedb.company 
            ON purchases.comp_id = company.comp_id
            JOIN employeedb.transaction_type 
            ON purchases.trans_type_id =transaction_type.type_id
            WHERE p_id=? OR
            p_reciept_no=?`;
        myconn.query(sqlQ, [pDSearchkey, pDSearchkey], (err, result) => {
            if (err) throw err
            else if (result.length > 0) {
                res.render('api/newPurchase', { dataD: result, dataDmsg: false, user: req.user })
            } else {
                res.render('api/newPurchase', { newP:true, dataDmsg: true, user: req.user })
            }
        })
    }

});

purchase_routs.post('/api/deletePurchaseRecord', [], authController.isloggedIn, (req, res) => {
    let key = req.body.p_id;
    // console.log(key)
    let sqlQ = `DELETE FROM purchases WHERE p_id=?;`
    myconn.query(sqlQ, [key], (err, result) => {
        if (err) throw err
        else {
            res.render('api/newPurchase', { pDelmsg: true, user: req.user })
        }
    })
});
// Search All data using multiple keys 
purchase_routs.post('/api/loadallPData',[
    body('skey').not().isEmpty().trim().escape().withMessage('Please Enter "Purchase ID", Company Name, User Name or Receipt No. '),
], authController.isloggedIn, (req, res) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newPurchase', { alerts , user: req.user});
    } else {
        let skey = req.body.skey;
    let q = `SELECT p_id,
        company.comp_name, 
        transaction_type.type_name,
        users.user_name,
        purchases.p_amount, 
        purchases.p_payment, 
        purchases.p_com, 
        purchases.p_reciept_no,  
        purchases.remarks from employeedb.purchases
        JOIN employeedb.company 
        ON purchases.comp_id = company.comp_id
        JOIN employeedb.transaction_type 
        ON purchases.trans_type_id =transaction_type.type_id
        JOIN users ON purchases.user_id = users.user_id
        where p_id=? OR
        comp_name=? OR
        user_name=? OR
        type_name=? OR 
        p_reciept_no =? 
        ORDER BY p_id DESC`
    myconn.query(q, [skey, skey, skey, skey, skey,], (err, r) => {
        
        if (err) throw err
        else if (r.length > 0) {
            // console.log(r)
            res.render('api/newPurchase', { newP:true, allPData: r, allPDataMst: false, allPDataMst2: true, user: req.user })
        }
        else {
            res.render('api/newPurchase', { newP:true, allPDataMsg: true, user: req.user })
        }
    })
    }
    
});
// search purchase data
purchase_routs.post('', authController.isloggedIn, [
    body('pDSearchkey').not().isEmpty().trim().escape().withMessage('Please Enter Valid Purchase ID or Receipt No!')
], (req, res) => {
    let pDSearchkey = req.body.pDSearchkey;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newPurchase', { alerts });
    } else {
        let sqlQ = `SELECT p_id,
            company.comp_name as comp_name, 
            transaction_type.type_name as type_name,
            purchases.p_amount, 
            purchases.p_payment, 
            purchases.p_com, 
            purchases.p_reciept_no,  
            purchases.remarks from employeedb.purchases
            JOIN employeedb.company 
            ON purchases.comp_id = company.comp_id
            JOIN employeedb.transaction_type 
            ON purchases.trans_type_id =transaction_type.type_id
            WHERE p_id=? OR
            p_reciept_no=?`;
        myconn.query(sqlQ, [pDSearchkey, pDSearchkey], (err, result) => {
            if (err) throw err
            else if (result.length > 0) {
                res.render('api/newPurchase', { dataD: result, dataDmsg: false, user: req.user })
            } else {
                res.render('api/newPurchase', { dataDmsg: true, user: req.user })
            }
        })
    }

});
// update purchse data 


module.exports = purchase_routs;
/*
INSERT INTO `employeedb`.`purchases` 
(`comp_id`, `p_amount`, `p_payment`, `p_reciept_no`, `p_com`, `remarks`) 
VALUES ((select comp_id from company where comp_name='MTN'),'1300', '1100', '06', '7', 'none'); */