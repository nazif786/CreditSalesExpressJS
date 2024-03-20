const express = require('express');
const myconn = require('../db/conn');
const comp_routs = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('./auth')


// add new employee

comp_routs.post('/api/newCompany', authController.isloggedIn, [
    body('comp_name').not().isEmpty().trim().escape().withMessage('Company Name can not be empty'),
    body('comp_mobile').not().isEmpty().trim().withMessage('Mobile Number can not be empty'),
    body('comp_mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('comp_email').optional({ checkFalsy: true }).isEmail().withMessage('Please Enter Valid Email ID')
], (req, res) => {
    // fetching data from form 
    // res.send(req.query); 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newCompany', { alerts });
    }
    else {
        const { comp_name, comp_mobile, comp_email, comp_address } = req.body;

        let qry = "SELECT * FROM company WHERE comp_name=?";
        myconn.query(qry, [comp_name], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                if (result.length > 0) {
                    // message if mobile no or email aleady exists 
                    res.render('api/newCompany', { chmsg: true ,user: req.user });
                } else {
                    // insent qeury             
                    let qryInsertEmp = "INSERT INTO company (comp_name, comp_mobile, comp_email, comp_address) VALUES (?, ?, ?, ?)";
                    myconn.query(qryInsertEmp, [comp_name, comp_mobile, comp_email, comp_address], (err, results) => {
                        if (err)
                            throw err;
                        else {
                            if (results.affectedRows > 0) {
                                res.render('api/company', { msg: true ,user: req.user });
                            }
                        }
                    });
                }
            }
        });
    }

});
// search Customer rout 
comp_routs.post('/api/searchComp', authController.isloggedIn,(req, res) => {
    const { comp_name } = req.body;
    let searchQueryComp = "SELECT * FROM company WHERE comp_name=?";
    myconn.query(searchQueryComp, [comp_name], (err, result) => {
        if (err)
            throw err
        else {
            if (result.length > 0) {
                res.render('api/company', { compSaerchFound: true, compSaerch: false, data: result ,user: req.user });
            } else {
                res.render('api/company', { compSaerchFound: false, compSaerch: true, user: req.user });
            }
        }
    });
});
// update COMPANY record 
comp_routs.post('/api/updateCompany', authController.isloggedIn, [
    body('comp_name').not().isEmpty().trim().escape().withMessage('Company Name can not be empty'),
    body('comp_mobile').not().isEmpty().trim().withMessage('Mobile Number can not be empty'),
    body('comp_mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('comp_email').optional({ checkFalsy: true }).isEmail().withMessage('Please Enter Valid Email ID')
], (req, res) => {
    // update company Record 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/company', { alerts, user: req.user });
    }
    else {
        const { comp_id, comp_name, comp_mobile, comp_email, comp_address } = req.body;
        let updateQueryComp = "UPDATE company SET comp_name=?,comp_mobile=?,comp_email=?,comp_address=? WHERE comp_id=?";
        myconn.query(updateQueryComp, [comp_name, comp_mobile, comp_email, comp_address, comp_id], (err, result) => {
            if (err)
                throw err
            else {
                if (result.affectedRows > 0) {
                    res.render('api/company', { updatemsg: true, user: req.user });
                }
            }
        });
    }

});
// search customer to delete data 
comp_routs.post('/api/delComp', authController.isloggedIn,(req, res) => {
    const { comp_name } = req.body;
    let searchQueryComp2 = "SELECT * FROM company WHERE comp_name=?";
    myconn.query(searchQueryComp2, [comp_name], (err, result) => {
        if (err) throw err
        else {
            if (result.length > 0) {
                res.render('api/company', { compFound: true, compdel: false, data: result, user: req.user });
            } else {
                res.render('api/company', { compFound: false, compdel: true, user: req.user });
            }
        }
    });
});
// delete customer record 
comp_routs.post('/api/deleteCompany', authController.isloggedIn,(req, res) => {
    // delete company  
    const { comp_id } = req.body;
    let delQueryCust = "DELETE FROM company WHERE comp_id=?";
    myconn.query(delQueryCust, [comp_id], (err, result) => {
        if (err)
            throw err
        else {
            if (result.affectedRows > 0) {
                res.render('api/company', { delrecord: true, user: req.user });
            }
        }
    });
});
// show all Customers records  
comp_routs.get('/api/showallComp', authController.isloggedIn,(req, res) => {
    let SelectQueryComp = "SELECT * FROM company";
    myconn.query(SelectQueryComp, (err, results) => {
        if (err)
            throw err
        else {
            res.render('api/company', { data2: results, user: req.user });
        }
    });
});

module.exports = comp_routs; 
