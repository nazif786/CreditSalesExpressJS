const express = require('express');
const myconn = require('../db/conn');
const logs_routs = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('./auth')


// authController.isloggedIn,

logs_routs.post('/salesUpdateLogs', authController.isloggedIn,authController.isAdmin, (req, res) => {
    let sql = `SELECT * FROM employeedb.saleschanges;`;
    myconn.query(sql, (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                r = results;
                // console.log(r)
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.changedAt
                    i.changedAt = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()+ '-' + reg_date.getHours() + ':' + reg_date.getMinutes();                       
                }
                // console.log(r)
                res.render('logs', {
                    salesDatamsg: true,
                    saleChangeData: r,
                    user:req.user 
                });
            } else {
                res.render('logs', { msg: 'No data found' });
            }
        }
    });
});
logs_routs.post('/salesDeleteLogs', authController.isloggedIn,authController.isAdmin,(req, res) => {
    let sql = `SELECT * FROM employeedb.salesdelete;`;
    myconn.query(sql, (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                r = results;
                // console.log(r)
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.sale_date
                    i.sale_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()+ '-' + reg_date.getHours() + ':' + reg_date.getMinutes();                       
                    let reg_date2 = i.deletedAt
                    i.deletedAt = reg_date2.getFullYear() + '-' + (reg_date2.getMonth() + 1) + '-' + reg_date2.getDate()+ '-' + reg_date2.getHours() + ':' + reg_date2.getMinutes();
                }
                // console.log(r)
                res.render('logs', {
                    salesDeletemsg: true,
                    saleDeleteData: r,
                    user:req.user 
                });
            } else {
                res.render('logs', { msg: 'No data found' });
            }
        }
    });
});

logs_routs.post('/purchaseUpdateLogs', authController.isloggedIn,authController.isAdmin,(req, res) => {
    let sql = `SELECT * FROM employeedb.purchasechanges;`;
    myconn.query(sql, (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                r = results;
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.changedAt
                    i.changedAt = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()+ '-' + reg_date.getHours() + ':' + reg_date.getMinutes();                       
                }
                // console.log(r)
                res.render('logs', {
                    purchaseDatamsg: true,
                    purchaseChangeData: r,
                    user:req.user 
                });
            } else {
                res.render('logs', { msg: 'No data found' });
            }
        }
    });
});
logs_routs.post('/purchaseDeleteLogs', authController.isloggedIn,authController.isAdmin,(req, res) => {
    let sql = `SELECT * FROM employeedb.purchasedelete;`;
    myconn.query(sql, (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                r = results;
                // console.log(r)
                for (let i of r) {
                    // console.log(i.changedAt)
                    let reg_date = i.p_date
                    i.p_date = reg_date.getFullYear() + '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()+ '-' + reg_date.getHours() + ':' + reg_date.getMinutes();                       
                    let reg_date2 = i.deletedAt
                    i.deletedAt = reg_date2.getFullYear() + '-' + (reg_date2.getMonth() + 1) + '-' + reg_date2.getDate()+ '-' + reg_date2.getHours() + ':' + reg_date2.getMinutes();
                }
                console.log(r)
                res.render('logs', {
                    purchaseDeletemsg: true,
                    purchaseDeleteData: r,
                    user:req.user 
                });
            } else {
                res.render('logs', { msg: 'No data found' });
            }
        }
    });
});

module.exports = logs_routs; 
