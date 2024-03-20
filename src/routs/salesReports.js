const express = require('express');
const myconn = require('../db/conn');
const salesR_routs = express.Router();
const app2 = express()
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const authController = require('./auth')

let saleTransactins = []; 
salesR_routs.post('/api/salesReports', authController.isloggedIn,(req, res) => {
    let sqlquery = `SELECT 
            customer_sales.sale_id, 
            customers.cust_fname as name,
            concat(customers.cust_fname, " ", customers.cust_lname) as full_name,
            company.comp_name as cname, 
            customer_sales.user_id, 
            users.user_name, 
            transaction_type.type_name as tname, 
            customer_sales.amount, payment, 
            customer_sales.reciept_no, 
            customer_sales.balance, 
            customer_sales.sale_date, 
            customer_sales.remarks from customer_sales 
            JOIN customers ON customer_sales.cust_id=customers.cust_id
            JOIN company ON customer_sales.comp_id = company.comp_id
            JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id
            JOIN users ON customer_sales.user_id=users.user_id
            `
    myconn.query(sqlquery, (err, result) => {
        if (err) throw err
        else {
            if (result.length > 0) {
                r = result;
                for (const i of r) {
                    i.balance = i.amount - i.payment;
                    let reg_date = i.sale_date
                    i.sale_date = reg_date.getFullYear()+ '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()
                }
                res.render('api/salesReports', { saleData: r, show:true, user: req.user})
                saleTransactins=result;
                //console.log(saleTransactins); 
            }
        }
    })
});

salesR_routs.post('/api/searchReports', authController.isloggedIn,[
    body('searchKey').trim().escape()
], (req, res) => {
    let searchKey = req.body.searchKey;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/salesReports', { alerts });
    }
    else {
        let sql = `SELECT 
        customer_sales.sale_id, 
        customers.cust_fname as name,
        concat(customers.cust_fname, " ", customers.cust_lname) as full_name,
        company.comp_name as cname, 
        users.user_name ,
        customer_sales.user_id, 
        transaction_type.type_name as tname, 
        customer_sales.amount, payment, 
        customer_sales.reciept_no, 
        customer_sales.sale_date, 
        customer_sales.remarks from customer_sales 
        JOIN customers ON customer_sales.cust_id=customers.cust_id
        JOIN company ON customer_sales.comp_id = company.comp_id
        JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id
        left JOIN users ON customer_sales.user_id = users.user_id
            WHERE customers.cust_fname=? OR
            customers.cust_lname=? OR
            company.comp_name=? OR
            transaction_type.type_name=? OR
            customer_sales.sale_id =?
            `
        myconn.query(sql, [searchKey,searchKey,searchKey,searchKey,searchKey], (err, result) => {
            if (err) throw err
            else {
                if (result.length > 0) {
                    r = result;
                    for (const i of r) {
                        i.balance = i.amount - i.payment;
                        let reg_date = i.sale_date
                        i.sale_date = reg_date.getFullYear()+ '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()
                    }
                    res.render('api/salesReports', { saleData: r, show:true, user: req.user })
                    // console.log(result) 
                } else {
                    res.render('api/salesReports', { errmsg: true, show:false, user: req.user })
                }
            }
        })
    }

})
// salesR_routs.post('/api/updateSaleSearch', authController.isloggedIn,[
//     body('searchKeyUpdate').trim().escape()
// ], (req,res)=>{
//     const searchKeyUpdate = req.body.searchKeyUpdate; 
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const alerts = errors.array();
//         res.render('api/salesReports', { alerts });
//     } 
//     else{
//     let sqlquery = `SELECT 
//     customer_sales.sale_id, 
//     customers.cust_fname as name,
//     concat(customers.cust_fname, " ", customers.cust_lname) as full_name,
//     company.comp_name as cname, 
//     customer_sales.user_id, 
//     transaction_type.type_name as tname, 
//     customer_sales.amount, payment, 
//     customer_sales.reciept_no, 
//     customer_sales.sale_date, 
//     customer_sales.remarks from customer_sales 
//     JOIN customers ON customer_sales.cust_id=customers.cust_id
//     JOIN company ON customer_sales.comp_id = company.comp_id
//     JOIN transaction_type ON customer_sales.trans_type_id = transaction_type.type_id
//         WHERE customers.cust_fname=? OR
//         customers.cust_lname=? OR
//         company.comp_name=? OR
//         transaction_type.type_name=? OR
//         customer_sales.sale_id=? 
//         `;
//     myconn.query(sqlquery, 
//         [searchKeyUpdate,searchKeyUpdate,searchKeyUpdate,searchKeyUpdate,searchKeyUpdate]
//         , (err, result)=>{
//         if (err) throw err 
//         else {
//             if(result.length>0){
//                 res.render('api/salesReports', { saleDataUpdate: result, showU:true, user: req.user})

//             }
//             else
//             {
//                 res.render('api/salesReports', {errmsg:true, showU:false, user: req.user})
//             }
//         }
//     }) 
//     }
// });

module.exports = salesR_routs;
