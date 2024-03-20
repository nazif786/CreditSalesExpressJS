const express = require('express');
const myconn = require('../db/conn');
const login_rout = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const authController = require('./auth');
// const request = require('request');
const { json } = require('body-parser');
const fetch = require('isomorphic-fetch')

// login_rout.post('/api/log', async(req, res) => {
//     let uid = req.body.user_id;
//     let username = req.body.username;  
//     let password = req.body.password;
//     console.log(req.body)
//     let sqlQ = `SELECT password FROM users WHERE user_name=?`;
//     myconn.query(sqlQ, [username], async(err, resul) => {
//         //const pass = ;
//         await bcrypt.compare(password, resul[0].password, (err, result2)=> {
//             // result == true
//             if (result2 == true) {
//                 let q = `SELECT * FROM users WHERE user_name=?`
//                 // Ensure the input fields exists and are not empty
//                 if (username && password) {
//                     // Execute SQL query that'll select the account from the database based on the specified username and password
//                     myconn.query(q, [username], (error, results)=> {
//                         // If there is an issue with the query, output the error
//                         if (error) throw error;
//                         // If the account exists
//                         if (results.length > 0) {
//                             // Authenticate the user
//                             req.session.loggedin = true;
//                             req.session.username = username;
//                             // Redirect to home page
//                             res.redirect('/');
//                         } else {
//                             res.send('Incorrect Username and/or Password!');
//                         }
//                         res.end();
//                     });
//                 } else {
//                     res.render('/', 'Please enter Username and Password!');
//                     res.end();
//                 }
//             } else{
//                 res.render('api/login', {err_msg:true})
//             }


//         });
//     })




// })

login_rout.post('/api/log', async (req, res) => {
    try {
        let { username, password } = req.body;
        const resKey = req.body['g-recaptcha-response']
        let secretKey = process.env.GOOGLECAPTCHASECRETKEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`;
        if (!username || !password) {
            res.render('api/login', {
                message: 'Please Enter Username and password'
            })
        }
        fetch(url, {
            method: 'post',
        })
            .then((response) => response.json())
            .then((google_response) => {
                if (google_response.success == true) {
                    
                    let sqlQ = `SELECT * FROM users WHERE user_name=?`;
                    myconn.query(sqlQ, [username], async (err, resul) => {
                        // console.log(resul)
                        if (err) throw err
                        else if (resul.length == 0) {
                            res.render('api/login', {
                                message: 'Username or password is invalid'
                            })
                        } else if (!(await bcrypt.compare(password, resul[0].password))) {
                            res.render('api/login', { essage: 'Username or password is invalid' })
                        } else {
                            const id = resul[0].user_id;
                            let today = new Date();       
                            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + '-' + today.getMinutes();
                            let sql =`UPDATE users SET last_login=? WHERE user_id =?`;
                            myconn.query(sql, [date, id], (err, resultss)=>{
                                if (err) throw err
                                else {
                            // let privateKey = 'kabul@123@kaBulJnTuH'; 
                            // console.log(privateKey); 
                            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRES_IN, // expiring in 30 minutes, Math.floor(Date.now() / 1000) + (30 * 60)
                                // exp: Math.floor(Date.now() / 1000) + (30 * 60), // expiring in 30 minutes

                            })
                            // console.log('The token is: '+ token)

                            const cookieOptions = {
                                expires: new Date(
                                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 // 30 days 
                                ),
                                httpOnly: true,
                                // secure: true // only over https 
                            }
                            res.cookie('jwt', token, cookieOptions);
                            res.redirect('/')
                                }
                            })
                        }
                    })
                } else {
                    res.render('api/login', {
                        message: 'Wrong captcha entered'
                    })
                }
            })
            .catch((error) => {
                return res.json({ error })
            })
    }
    catch (error) {
        console.log(error)
    }
})

login_rout.post('/api/profileInfo', authController.isloggedIn, (req, res) => {
    // let currentPassword = req.body.currentPassword;
    // let sql = `SELECT * FROM users WHERE user_id=?`
    // myconn.query(sql, [user_id], (err, results)=>{
    //     if (err) throw err
    //     else if(results.length>0){

    //     }
    // })
})

login_rout.post('/api/passwordReset', [
    body('tazkira_id').not().isEmpty().trim().escape().withMessage('Tazkira number can not be empty'),
    body('tazkira_id').isNumeric().withMessage('Enter correct tazkra number'),
    body('username').not().isEmpty().trim().withMessage('Username can not be empty'),
    body('mobile_no').not().isEmpty().isMobilePhone().withMessage('Enter valid mobile number'),
    body('mobile_no').not().isEmpty().withMessage('Enter valid mobile number'),
    body('password').isStrongPassword({
        minLength: 7,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    }).withMessage(`Password must be greater than 7 charactor
    and it should contain at least one uppercase letter, one lowercase letter,one number and one special charactor`),
    body('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password does not match ');
        }
        return true;
    })

], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/passwordRecover', { alerts });
    }
    else {
        const { tazkira_id, username, mobile_no, password, cpassword } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); 
        

        let sql = `SELECT users.user_id, users.user_name, users.password,
    employees.tazkira_id, 
    employees.mobile
    from employeedb.users
    JOIN employeedb.employees 
    ON  users.emp_id = employees.id
    WHERE users.user_name=? and 
    employees.tazkira_id=? and
    employees.mobile=?`;
        myconn.query(sql, [username, tazkira_id, mobile_no], (err, results) => {
            if (err) throw err
            if (results.length > 0) {
                D = results[0].user_id
                let sql = "UPDATE users SET password=? WHERE user_id =?";
                myconn.query(sql, [hashedPassword,D], (err, result)=>{
                    if (err) throw err
                    res.render('api/login', { msg: 'passowrd upadated successfully' });
                })
            } else { 
                res.render('api/passwordRecover', { msg2: 'Wrong information entered' });
            }
        })
    }


})
module.exports = login_rout; 