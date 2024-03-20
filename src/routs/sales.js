const express = require('express');
const myconn = require('../db/conn');
const sales_routs = express.Router();
const app2 = express()
const multer  = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const authController = require('./auth')

let compData = []
let compData2 = []
let transactionData = []
let TrData2 = []
let custData = []
let saleBalance = []
let sSData = []
let sSDataD = []
let transTypeDefault = []
let comptyTypeDefault = []

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/sale_reciept_images')
    },
    filename: function (req, file, cb) {
     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
  })
const upload = multer({ 
    storage: storage, 
    // fileFilter: function(req, file, callback){
    // }
})
// new sale 
app2.post('/api/newSaleForm',authController.isloggedIn ,(req, res,) => {
    res.render('api/newSale',{swd:true,user: req.user })
})

// ///////////////////////////////////////////////////////////////////////////////////////////////
// new Sale  
app2.post('/api/selectCustomer', authController.isloggedIn,[
    body('cust_fname').trim().escape()
], (req, res) => {

    const cust_fname = req.body.cust_fname;
    const cust_name = req.body.cust_fname;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newEmployee', { alerts });
    } 
    else 
    {
        myconn.query((`
        SELECT comp_id, comp_name FROM employeedb.company ORDER BY comp_name ASC; 
        SELECT type_name FROM employeedb.transaction_type order by type_name asc; 
        SELECT cust_id, cust_u_id, concat(cust_fname, ' ', cust_lname) as 'fullname', cust_mobile, cust_email, cust_comi FROM employeedb.customers  WHERE (cust_fname="${cust_name}") OR (cust_u_id='${cust_name}'); 
        SELECT user_id, user_name FROM employeedb.users WHERE user_id=6; 
        SELECT customer_sales.cust_id, customers.cust_fname,        
            (sum(customer_sales.amount)-sum(customer_sales.payment)) as balance 
            FROM employeedb.customer_sales
            JOIN employeedb.customers 
            ON customer_sales.cust_id = customers.cust_id
            WHERE (customers.cust_fname="${cust_name}") OR (customers.cust_u_id='${cust_name}') OR (customer_sales.cust_id='${cust_name}') OR (customers.cust_lname='${cust_name}')
            ;
`), [1, 2, 3, 4,5], (err, result) => {
        if (err)
            throw err.message
        else {
            if (result.length > 0) {

                let b = result[4].balance;
                
                if (b != null) {
                    b = 0;
                } else {
                    b = result[4];
                }

                // console.log(b)
                res.render('api/newSale', {
                    company_data: result[0],
                    tran_data: result[1],
                    data: result[2],
                    user_data: result[3],
                    bal: b,
                    swd:true,
                    user: req.user
                });
                //console.log(req.user.user_id)
                // console.log(result[4])
                // compData = result[0];
                // transactionData = result[1];
                custData = result[2];
                // console.log(result[0]); 
                // console.log(result[1]); 
                // console.log(result[2]);
                //console.log(custData); 
            } else {
                res.render('api/newSale', { empSaerch: true });
            }
        }

    });
    }
    
}); // load compnay and trnsaction type data 
app2.post('/api/loadcompany', authController.isloggedIn,(req, res) => {
    let cpname = req.body.cname;
    // console.log(cpname)
    let q = "SELECT * FROM employeedb.company WHERE comp_name=?";
    myconn.query(q, [cpname], (err, results) => {
        if (err)
            throw err
       
        else if (results.length > 0) {
            // console.log(results)
            res.render('api/newSale.hbs', {
                mydata: results,
                user: req.user,
                coname:results
            });
            compData = results;
            // console.log(compData);
        } else {
            console.log("error happened")
        }
    });
});
app2.post('/api/loadtrans', authController.isloggedIn,(req, res) => {
    let trans_type = req.body.tname;
    let customer_id = custData[0].cust_id;
    let query = ``;
    myconn.query(`
    SELECT * FROM employeedb.transaction_type WHERE type_name=('${trans_type}');
    SELECT cust_id, (sum(amount)-sum(payment)) as balance FROM employeedb.customer_sales WHERE cust_id=(${customer_id}) group by cust_id;
     `   , [1, 2], (err, rsl) => {
            if (err) throw err
            else {
                // let bal = rsl[1];
                // if (bal != null) { 
                //     let balance = bal[0].balance; 
                // }
                // else {
                //     bal = 0;
                // }
                res.render('api/newSale', {tdata: rsl[0], balance:rsl[1], user: req.user});
                transactionData = rsl[0];
                saleBalance = rsl[1]; 
                // console.log(bal);
                
                // console.log(result);     
                // console.log(result[0])
            }
        });
}); // submit new sale data
app2.post('/api/transaction', upload.single('saleReciptImg'), authController.isloggedIn,[
    body('reciept_no').not().isEmpty().trim().escape().withMessage('Receipt Number can not be empty'),
    body('reciept_no').isNumeric().withMessage('Receipt Number can not contain alphabets or special charactors'),
    body('amount').not().isEmpty().withMessage('Amount can not be empty'),
    body('amount').isCurrency().withMessage('Amount must be currency'),
    body('payment').not().isEmpty().withMessage('payment can not be empty'),
    body('payment').isCurrency().withMessage('payment must be currency'),

], (req, res, next) => {
    let img = req.file; 
    let saleReciptImg = req.body.saleReciptImg;
    let m;
    if ((typeof(img) != 'undefined')) {2
        m = img.path;
    } else {
        m = ''
        console.log('image not selected')
    }
        let cond = compData;
        let cond2 = transactionData;
        if ((cond.length == 0) || (cond2.length==0) || (custData==0)){
            res.render('api/newSale',{alr:'please Select company name and transaction type'})
        } else {
            let comp_id = compData[0].comp_id
            let trans_type_id = transactionData[0].type_id
            let cust_id = custData[0].cust_id
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    //
            // console.log(trans_type_id)
            // console.log(comp_id)
            // console.log(cust_id)
            // let user_id = req.body.user_id;
            let { reciept_no, amount, payment, remarks } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const alerts = errors.array();
                res.render('api/newSale', { alerts });
            }
            else {
                user_id = req.user.user_id;
                let qeury = `INSERT INTO employeedb.customer_sales 
                        (cust_id, comp_id, user_id, trans_type_id, amount, payment, reciept_no, sale_date, remarks, image) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
                myconn.query(qeury, [cust_id, comp_id, user_id, trans_type_id, amount, payment, reciept_no, date, remarks,m], (err, result) => {
                    if (err)
                        throw err.message
                    else {
                        res.render('api/newSale', { newS:true, salemsg: true, user: req.user })
                    }
                });
            }
        
        }
    
    //console.log(comp_id);
    //console.log('transaction id ' +tid); 
});

// ------------------ search sales -----------------------
app2.post('/api/loadallSData',authController.isloggedIn,[
    body('skey').not().isEmpty().trim().escape().withMessage('Please Enter sale ID, Customer Name, Company Name, User Name, Receipt No, or Transaction Type'),
], authController.isloggedIn, (req, res) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newSale', { alerts , user: req.user});
    } else {
        let skey = req.body.skey;
    let sql = ` SELECT 
        customer_sales.sale_id, 
        customers.cust_u_id,
        customers.cust_fname as name,
        concat(customers.cust_fname, " ", customers.cust_lname) as name,
        company.comp_name as cname, 
        users.user_name, 
        transaction_type.type_name as tname, 
        customer_sales.amount, payment, 
        customer_sales.reciept_no, 
        customer_sales.sale_date, 
        customer_sales.remarks,
        customer_sales.balance from customer_sales 
        JOIN customers ON customer_sales.cust_id=customers.cust_id
        JOIN company ON customer_sales.comp_id = company.comp_id
        JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id 
        JOIN users ON customer_sales.user_id = users.user_id
        where sale_id=? OR
        cust_fname OR
        comp_name=? OR
        user_name=? OR
        type_name=? OR 
        customers.cust_u_id=? OR
        reciept_no =? 
        ORDER BY sale_id DESC`
    myconn.query(sql, [skey, skey, skey, skey, skey,skey], (err, result) => {
        
        if (err) throw err
        else if (result.length > 0) {
            let r = result
            for (let i of r) {
                let reg_date2 = i.sale_date
                i.sale_date = reg_date2.getFullYear() + '-' + (reg_date2.getMonth() + 1) + '-' + reg_date2.getDate();                       
            }
            res.render('api/newSale', { newS:true ,allSData: r, allSDataMst: false, allSDataMst2: true, user: req.user })
        }
        else {
            res.render('api/newSale', {
                alr: 'Please Enter sale ID, Customer Name, Customer Unique Number, Company Name, User Name, Receipt No, or Transaction Type',
                user: req.user,
                newS:true
            })
        }
    })
    }
    
});
//   ---------------- sales Update ---------------------
// first search the sale data using sale id or reciept no
app2.post('/api/searchToUpdateSales', authController.isloggedIn, [
    body('sUSearchkey').not().isEmpty().trim().escape().withMessage('Please Enter Correct Sale-id or Reciept-no. '),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newSale', { alerts, user: req.user });
    } else {
        let sUSearchkey = req.body.sUSearchkey;
        let sql = ` SELECT 
        customer_sales.sale_id, 
        concat(customers.cust_fname, " " ,customers.cust_lname) as name,
        customers.cust_u_id,
        customers.cust_mobile,
        customers.cust_email,
        customers.cust_comi,
        customer_sales.sale_date,
        company.comp_name as cname, 
        company.comp_id,
        users.user_name, 
        transaction_type.type_name as tname, 
        transaction_type.type_id,
        customer_sales.amount, payment, 
        customer_sales.reciept_no, 
        customer_sales.remarks,
        customer_sales.image,
        customer_sales.balance from customer_sales 
        JOIN company ON customer_sales.comp_id = company.comp_id
        JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id 
        JOIN users ON customer_sales.user_id = users.user_id 
        jOIN customers ON customer_sales.cust_id = customers.cust_id
        where sale_id=? OR
        reciept_no =?`
        myconn.query(sql, [sUSearchkey, sUSearchkey], (err, result) => {        
            if (err) throw err
            else if (result.length > 0) {
                r = result;
                for (let i of r) {
                    let reg_date = i.sale_date
                    i.sale_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate();                       
                }
                let cbalance = result[0].amount - result[0].payment
                // console.log(result)
                transTypeDefault = result;
                comptyTypeDefault = result;
                // console.log(transTypeDefault)
                // console.log(comptyTypeDefault)
                res.render('api/newSale', { sSData:r ,cbalance:cbalance , saleDataU: true,user:req.user})
                sSData = r
            }
            else {
                res.render('api/newSale', {newS:true, alr:'Please Enter Correct Sale-id or Reciept-no. ',user:req.user})

            }

        })
    }
})
// second: load company and transaction Data form database
app2.post('/api/updateSaleInfo', authController.isloggedIn, (req, res)=>{
    let sql = ` SELECT * FROM transaction_type;
                    SELECT * FROM company;`
        myconn.query(sql, [1,2], (err, result) => { 
            if (err) throw err
            else if (result.length > 0) {
                transactionData = result[0]
                compData = result[1]
                // console.log(sSData)                
                // console.log(transactionData)
                // console.log(compData)

                res.render('api/newSale', { SdataUpdation:true, sSData2: sSData, tran_data: transactionData, company_data: compData })
            }
            else {
                res.render('api/newSale', {alr:'Problem loading company or transactin data'})
            }
        })
            // console.log(r1)
            // console.log(r2)

            // console.log(result[1])
})
// thrird: selcect specific company 
app2.post('/api/loadcompany2', authController.isloggedIn, (req, res) => {
    let cpname = req.body.cppname;
    // console.log(cpname)
    let q = "SELECT * FROM employeedb.company WHERE comp_name=?";
    myconn.query(q, [cpname], (err, results) => {
        if (err)
            throw err
       
        else if (results.length > 0) {
            // console.log(results)
            res.render('api/newSale.hbs', {
                mydata: results,
                user: req.user,
                coname:results
            });
            compData2 = results;
            // console.log(compData2);
        } else {
            console.log("error happened")
        }
    });
}); 
// forth: select specific transaction type 
app2.post('/api/loadtrans2', authController.isloggedIn,(req, res) => {
    let trans_type = req.body.tname;
    //let customer_id = custData[0].cust_id;
    let query = ``;
    myconn.query(`
    SELECT * FROM employeedb.transaction_type WHERE type_name=('${trans_type}');
     `   ,(err, rsl) => {
            if (err) throw err
            else {
                let bal = rsl[1];
                TrData2 = rsl;
                // console.log(TrData2)
                // let balance = bal[0].balance; 
                res.render('api/newSale', {tdata: rsl[0], user: req.user});
                
                // saleBalance = rsl[1]; 
                // console.log(bal);
                
                // console.log(rsl);     
                
                // console.log(result[0])
            }
        });
});

// fifth: grab new data and submit updates to db
app2.post('/api/submitSaleUpdate', authController.isloggedIn,
    [
    body('reciept_no').not().isEmpty().trim().escape().withMessage('Receipt Number can not be empty'),
    body('reciept_no').isNumeric().withMessage('Receipt Number can not contain alphabets or special charactors'),
    body('amount').not().isEmpty().withMessage('Amount can not be empty'),
    body('amount').isCurrency().withMessage('Amount must be currency'),
    body('payment').not().isEmpty().withMessage('payment can not be empty'),
    body('payment').isCurrency().withMessage('payment must be currency'),
], (req, res,next) => { 
     // default old data 
    // console.log(req.body)
    if (comptyTypeDefault.length == 0) {
        res.render('api/newSale', { alr: 'Data not Updated try again' })
        // next();
    } else
    {
        let x = [];
        let y = [];
        if (compData2.length==0){
            x = comptyTypeDefault[0].comp_id
            console.log('default')
        }else{
            x = compData2[0].comp_id
            console.log('update')
        }
        if (TrData2.length==0) {
            y = transTypeDefault[0].type_id
            console.log('default')
        }else {
            y = TrData2[0].type_id
            console.log('update')
        }
    console.log(x)
    console.log(y)
    let today = new Date();       
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + '-' + today.getMinutes();
    const { sale_id, reciept_no, amount, payment, remarks, invoice_pic } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newSale', { alr:'' });
    }
    else { 
        myconn.query('UPDATE employeedb.customer_sales SET comp_id=?, trans_type_id=?, reciept_no=?, amount=?, payment=?, remarks=?, updated_on=? WHERE sale_id=?'
            , [x, y, reciept_no, amount, payment, remarks, date, sale_id], (err, results) => {
            if (err) throw err
            else{
                res.render('api/newSale', {alr:'Data updated successfully',user: req.user, updatedData:results})
            } 
        })
        }
    }
})


//---------------------- saels Delete ----------------
// search data using sale_id or recipet no
app2.post('/api/searchToDeleteSales', authController.isloggedIn, [
    body('pDSearchkey').not().isEmpty().trim().escape().withMessage('Please Enter Correct Sale-id or Reciept-no. '),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newSale', { alerts, user: req.user });
    } else {
        let pDSearchkey = req.body.pDSearchkey;
        let sql = ` SELECT 
        customer_sales.sale_id, 
        concat(customers.cust_fname, " " ,customers.cust_lname) as name,
        customers.cust_u_id,
        customers.cust_mobile,
        customers.cust_email,
        customers.cust_comi,
        customer_sales.sale_date,
        company.comp_name as cname, 
        company.comp_id,
        users.user_name, 
        transaction_type.type_name as tname, 
        transaction_type.type_id,
        customer_sales.amount, payment, 
        customer_sales.reciept_no, 
        customer_sales.remarks,
        customer_sales.image,
        customer_sales.balance from customer_sales 
        JOIN company ON customer_sales.comp_id = company.comp_id
        JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id 
        JOIN users ON customer_sales.user_id = users.user_id 
        jOIN customers ON customer_sales.cust_id = customers.cust_id
        where sale_id=? OR
        reciept_no =?`
        myconn.query(sql, [pDSearchkey, pDSearchkey], (err, result) => {        
            if (err) throw err
            else if (result.length > 0) {
                r = result;
                for (let i of r) {
                    let reg_date = i.sale_date
                    i.sale_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate();                       
                }
                let cbalance = result[0].amount - result[0].payment
                // console.log(result)
                transTypeDefault = result;
                comptyTypeDefault = result;
                // console.log(transTypeDefault)
                // console.log(comptyTypeDefault)
                res.render('api/newSale', {sSDataD:r ,cbalance:cbalance , saleDataD: true,user:req.user})
                // sSDataD = r
            }
            else {
                res.render('api/newSale', {newS:true,alr:'Please Enter Correct Sale-id or Reciept-no. ',user:req.user})

            }

        })
    }
})
// delete sale data
app2.post('/api/deleteSaleData', authController.isloggedIn, (req, res) => {
    // console.log(sSDataD)
    console.log(req.body)
    let key = req.body.sale_id;
    if (key.length == 0) {
        res.render('api/newSale', {alr: 'Sale data not deleted'})
    } else {
        console.log('---------------------')

    console.log(key)
    let sqlQ = `DELETE FROM customer_sales WHERE sale_id=?;`
    myconn.query(sqlQ, [key], (err, result) => {
        if (err) throw err
        else {
            res.render('api/newSale', { alr: 'Sale data Deleted Successfully', user: req.user })
        }
    })
    }
    // // fetching data 
    // const {user_id, emp_id,id, user_name, password, is_admin} = req.body;
    // // sanitizatin xss ... 
    // let qryUser = "SELECT * FROM users WHERE user_name=? or password=?";
    // myconn.query(qryUser, [user_name, password], (err, result) => {
    //     if (err) {
    //         throw err;
    //     }
    //     else {
    //         if (result.length > 0) {
    //             // message if username or password aleady exists 
    //             res.render('api/newUser', { chmsg: true });
    //         } else {
    //             // insent qeury 
    //             var today = new Date();
    //             var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();                   
    //             let qryInsertUser = "INSERT INTO users (`user_name`, `password`, `is_admin`, `user_reg_date`, `emp_id`) VALUES (?, ?, ?, ?, ?)";
    //             myconn.query(qryInsertUser, [user_name, password, is_admin, date, id], (err, results) => {
    //                 if (err)
    //                     throw err;
    //                 else {
    //                     if (results.affectedRows > 0) {
    //                         res.render('api/user', { msg: true });
    //                     }
    //                 }
    //             });
    //         }
    //     }
});

module.exports = sales_routs;
module.exports = app2;
