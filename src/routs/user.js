const express = require('express');
const myconn = require('../db/conn');
const user_routs = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

let userdata =[]; 
// select employee to register as user 
user_routs.post('/api/selectEmployee',[
    body('fname').trim().escape()
], (req, res) => {
    const fname = req.body.f_name;
    console.log(fname)
    // console.log(name +'this is it')
    let searchQueryUser = "SELECT id, tazkira_id, CONCAT(fname, ' ' ,lname) as fullname, mobile, email FROM employees WHERE fname=? or id=?";
    myconn.query(searchQueryUser, [fname, fname], (err, result) => {
        if (err)
            throw err
        else {
            if (result.length > 0) {
                res.render('api/newUser', { data: result });
                userdata =result[0];  
            } else {
                // res.render('api/newUser', {empSaerch:true}); 
                res.render('api/newUser', { emp_found_msg:true });
                //console.log(result)
            }
        }
    });
});
// Add new User 
user_routs.post('/api/addUser',
    [
    body('user_name').not().isEmpty().trim().isLength({
        min: 5,
        max: 50
    }).withMessage('User Name can not be empty or less than 5 charactors'),
    body('password').isStrongPassword({
        minLength: 7,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    }).withMessage(`Password must be greater than 7 charactor
    and contain at least one uppercase letter, one lowercase letter,one number and one special charactor`),
    body('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
    ], async (req, res) => {
        if (userdata.length == 0) {
            res.render('api/newUser', {notEmp:'To add user select employee! '});
        } else {
            const { u_id, user_name, password, cpassword, is_admin } = req.body;
            let e_id = userdata.id;
            // console.log(typeof(e_id))
            // console.log(userdata.id + ' it comes from body'); 
            const hashedPassword = await bcrypt.hash(password, 10)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const alerts = errors.array(); 
                res.render('api/newUser', { alerts });
            } 
            else { 
                let qryUser = "SELECT * FROM users WHERE user_name=? or user_id=?";
                myconn.query(qryUser, [user_name, u_id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (result.length > 0) {
                            // message if username or password aleady exists 
                            res.render('api/newUser', { chmsg: true });
                        } else {
                            // insert qeury 
                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            let qryInsertUser = "INSERT INTO users (emp_id, user_name, password, is_admin, user_reg_date) VALUES (?, ?, ?,?,?)";
                            // console.log(e_id);
                            // console.log(typeof(e_id));
                            myconn.query(qryInsertUser, [e_id,user_name, hashedPassword, is_admin, date,], (err, results) => {
                                if (err)
                                    throw err;
                                else {
                                    if (results.affectedRows > 0) {
                                        res.render('api/user', { msg: true });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
});
// search user 
user_routs.post('/api/searchUser', (req, res)=>{
    let uid = req.body.user_id; 
    let q =`SELECT * FROM users WHERE user_id=? or user_name=?`
    myconn.query(q, [uid,uid],(err, result)=>{
        if (err) throw err 
        else {
            if(result.length > 0){
                res.render('api/user', {found_msg:true, notfound_msg:false, found_data: result})
            }
            else {
                res.render('api/user', {found_msg:false, notfound_msg:true})
            }
        }
    })
})
// update user data 
user_routs.post('/api/updateUserData', (req, res)=>{
    let {user_id, user_name, is_admin} = req.body;
    // console.log(user_id)
    // console.log(user_name)
    // console.log(is_admin)
    let q = `UPDATE employeedb.users SET user_name=?, is_admin=?  WHERE user_id=?;`
    myconn.query(q, [user_name, is_admin, user_id], (err, result)=>{
        if (err) throw err.message
        else {
            console.log(result)
            res.render('api/user', {updatemsg:true})
        }
    })
})
// search user to delete
user_routs.post('/api/delUser', (req, res)=>{
    let user_name = req.body.user_name;
    let q = `SELECT * FROM employeedb.users WHERE user_name = ?;`
    myconn.query(q, [user_name],(err, result2)=>{
        if (err) throw err.message
        else {
            res.render('api/user', {user_data_found_msg:true, user_data_found:result2})
        }
    })
})
//delete user data 
user_routs.post('/api/deleteUserData', (req, res)=>{
    let user_name = req.body.user_name;
    let q = `DELETE FROM employeedb.users WHERE (user_name = ?);`
    myconn.query(q, [user_name],(err, result)=>{
        if (err) throw err.message
        else {
            res.render('api/user', {deletmsg:true})
        }
    })
})

user_routs.get('/api/showAllUsers', (req, res)=>{
    sql = `SELECT * FROM users`;
    myconn.query(sql, (err, results)=>{
        if (err) throw err
        if (results.length>0){
            r = results;
            for (const i of r){
                let reg_date = i.user_reg_date
                i.user_reg_date = reg_date.getFullYear()+ '-' + (reg_date.getMonth() + 1) + '-' + reg_date.getDate()
                if (i.last_login==null){
                    i.last_login = "-"
                } else {
                    let l_login = i.last_login
                    i.last_login = l_login.getFullYear()+ '-' + (l_login.getMonth() + 1) + '-' + l_login.getDate()+ '-' + l_login.getHours()+ ':' + l_login.getMinutes();
                }
            }
            res.render('api/user', {allUserdata: r})
        }
        else{
            res.render('api/user', {msg: "No data"});
        }
    })
})

module.exports = user_routs; 
