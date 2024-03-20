const express = require('express');
const myconn = require('../db/conn');
const cust_routs = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('./auth')


// add new employee
cust_routs.post('/api/addNewCustomer',authController.isloggedIn,[
    body('cust_fname').not().isEmpty().trim().escape().withMessage('First Name can not be empty'),
    body('cust_lname').not().isEmpty().trim().escape().withMessage('Last Name can not be empty'),
    body('cust_mobile').not().isEmpty().trim().withMessage('Mobile Number can not be empty'),
    body('cust_mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('cust_email').trim(),
    body('cust_comi').not().isEmpty().trim().withMessage('Please enter customer commision percentage'),

    // body('cust_email').isEmpty().isEmail().normalizeEmail().withMessage('Please Enter Valid Email ID')
], (req, res) => {
    // fetching data from form 
    // res.send(req.query);  {}, fname, lname, father_name, mobile, email, address, status }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newCustomer', { alerts });
    }
    else {
        const { cust_u_id, cust_fname, cust_lname, cust_comi, cust_mobile, cust_email, cust_address } = req.body;
        let qry = "SELECT * FROM customers WHERE cust_mobile=? or cust_email=?";

        myconn.query(qry, [cust_mobile, cust_email, ], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                if (result.length > 0) {
                    // message if mobile no or email aleady exists 
                    res.render('api/newCustomer', { chmsg: true, user: req.user });
                } else {
                let qry = "SELECT * FROM customers WHERE cust_u_id=?";
                myconn.query(qry, [cust_u_id], (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        if (result.length > 0) {
                            // Unique id already exist 
                            res.render('api/newCustomer', { chmsg2: true, user: req.user });
                        }
                        else {
                            // insent qeury 
                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            let qryInsertEmp = "INSERT INTO customers (cust_u_id, cust_fname, cust_lname, cust_comi, cust_mobile,cust_email, cust_address, cust_reg_date) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
                            myconn.query(qryInsertEmp, [cust_u_id, cust_fname, cust_lname, cust_comi, cust_mobile, cust_email, cust_address, date], (err, results) => {
                                if (err)
                                    throw err;
                                else {
                                    if (results.affectedRows > 0) {
                                        res.render('api/customer', { msg: true, user: req.user });
                                    }
                                }
                            });
                        }
                    }

                });
                ///////////////////////////////////////////////////
            }
            }
        });
    }

});
// search Customer rout 
cust_routs.post('/api/searchCust', authController.isloggedIn, [
    body('cust_fname').not().isEmpty().trim().escape().withMessage('Please enter customer name or id')
], (req, res) => {
    const { cust_fname } = req.body;
    let searchQueryCust = "SELECT * FROM customers WHERE cust_fname=? or cust_id=? or cust_u_id=?";
    myconn.query(searchQueryCust, [cust_fname,cust_fname,cust_fname], (err, result) => {
        if (err)
            throw err
        else {
            if (result.length > 0) {
                res.render('api/customer', { 
                    empSaerchFound: true, 
                    empSaerch: false, 
                    data: result,
                    user:req.user
                });
            } else {
                res.render('api/customer', { empSaerchFound: false, empSaerch: true, user: req.user });
            }
        }
    });
});
// update Customer record 
cust_routs.post('/api/updateCustomer', authController.isloggedIn, [
    body('cust_fname').not().isEmpty().trim().escape().withMessage('First Name can not be empty'),
    body('cust_lname').not().isEmpty().trim().escape().withMessage('Last Name can not be empty'),
    body('cust_mobile').not().isEmpty().trim().escape().withMessage('Mobile Number can not be empty'),
    body('cust_mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('cust_u_id').not().isEmpty().withMessage('Customer Unique ID can not be empty'),
], (req, res) => {
    // update employee Record 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/customer', { alerts , user: req.user});
    }
    else {
        const { cust_u_id, cust_id, cust_fname, cust_lname, cust_comi, cust_mobile, cust_email, cust_address, cust_reg_date } = req.body;
        let updateQueryEmp = "UPDATE customers SET cust_u_id=?, cust_fname=?,cust_lname=?,cust_comi=?,cust_mobile=?,cust_email=?,cust_address=? WHERE cust_id=?";
        myconn.query(updateQueryEmp, [cust_u_id, cust_fname, cust_lname, cust_comi, cust_mobile, cust_email, cust_address, cust_id], (err, result) => {
            if (err)
                throw err
            else {
                if (result.affectedRows > 0) {
                    res.render('api/customer', { updatemsg: true, user: req.user });
                }
            }
        });
    }

});
// search customer to delete data 
cust_routs.post('/api/delCust',authController.isloggedIn, (req, res) => {
    const { cust_fname } = req.body;
    let searchQueryCust2 = "SELECT * FROM customers WHERE cust_fname=?";
    myconn.query(searchQueryCust2, [cust_fname], (err, result) => {
        if (err) throw err
        else {
            if (result.length > 0) {
                res.render('api/customer', { custFound: true, custdel: false, data: result, user: req.user });
            } else {
                res.render('api/customer', { custFound: false, custdel: true, user: req.user });
            }
        }
    });
});
// delete customer record 
cust_routs.post('/api/deleteCustomer',authController.isloggedIn, (req, res) => {
    // delete employee 
    const { cust_fname } = req.body;
    let delQueryCust = "DELETE FROM customers WHERE cust_fname=?";
    myconn.query(delQueryCust, [cust_fname], (err, result) => {
        if (err)
            throw err
        else {
            if (result.affectedRows > 0) {
                res.render('api/customer', { delrecord: true, user: req.user });
            }
        }
    });
});
// show all Customers records  
cust_routs.get('/api/showallCust', authController.isloggedIn,(req, res) => {
    let SelectQueryEmp = "SELECT * FROM customers";
    myconn.query(SelectQueryEmp, (err, results) => {
        if (err)
            throw err
        else { 
            r = results;
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.cust_reg_date
                    i.cust_reg_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate();                       
                }

            res.render('api/customer', { data2: r, user: req.user });
        }
    });
});

module.exports = cust_routs; 
