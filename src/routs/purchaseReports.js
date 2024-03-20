const express = require("express");
const myconn = require("../db/conn");
const routs = express.Router();
const purchase_routsR = express();
const { body, validationResult } = require("express-validator");
const { urlencoded } = require("body-parser");
const authController = require("./auth");

// const hbs = require('hbs');
// const Handlebars = require('handlebars')
// var paginate = require('handlebars-paginate')
// Handlebars.registerHelper('paginate', paginate);

//const mysql = require('mysql');

purchase_routsR.get(
  "/api/loadallPD",
  authController.isloggedIn,
  (req, res) => {
    sql = `SELECT p_id,
             company.comp_name, 
             transaction_type.type_name,
             users.user_name,
             purchases.p_amount, 
             purchases.p_payment, 
             purchases.p_com, 
             purchases.p_date, 
             purchases.p_reciept_no,  
             purchases.bal,  
             purchases.remarks from employeedb.purchases
             JOIN employeedb.company 
             ON purchases.comp_id = company.comp_id
             JOIN employeedb.transaction_type 
             ON purchases.trans_type_id =transaction_type.type_id
             JOIN users ON purchases.user_id = users.user_id 
             Order by p_id
             `;
    //LIMIT ${startLimit},${perPageResults}
    myconn.query(sql, (err, result) => {
      if (err) throw err;
      r = result;
      // console.log(r)
        for (let i of r) {
                i.bal = i.p_amount - i.p_payment;
                let reg_date2 = i.p_date
                i.p_date = reg_date2.getFullYear() + '-' + (reg_date2.getMonth() + 1) + '-' + reg_date2.getDate();                       
            }            

      res.render("api/purchaseReports", {
        load_msg: true,
        allDataP: result,
        load_msg2: false,
        user: req.user,
        // pagination:{
        //     page:page,
        //     iterator,
        //     endingLink,
        //     pageCount: numberOfPages,

        //}
      });
      // console.log(result)
    });
  }
);

/*
purchase_routsR.post('/api/searchPurchaseData', authController.isloggedIn, (req, res) => {
    let key = req.body.searchPurchase; 
    myconn.query(`SELECT p_id,
    company.comp_name, 
    transaction_type.type_name,
    users.user_name,
    purchases.p_amount, 
    purchases.p_payment, 
    purchases.p_com, 
    purchases.p_date, 
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
    ORDER BY p_id DESC`,
    [key, key, key, key, key], (err, resl) => {
        if (err) throw err
        else if (resl.length > 0) {
            r = resl;
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.p_date
                    i.p_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate();                       
                }
            res.render('api/purchaseReports', {load_msg: false, load_msg2: true, allData: resl, user: req.user});
        }else
        {
            res.render('api/purchaseReports', {searcherror: true});
        }
    })

});
*/
module.exports = purchase_routsR;
