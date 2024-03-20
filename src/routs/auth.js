const express = require('express');
const myconn = require('../db/conn');
const auth_rout = express.Router();
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcrypt') 
var jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.isAdmin = async(req, res, next) => {
    //console.log(req.cookies); 
    // let privateKey = 'kabul@123@kaBulJnTuH';
    if(req.cookies.jwt){
        try {
            // 1) verifying that token exits 
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //console.log(decoded); 

            // 2) check the user still exits 
            myconn.query('SELECT * FROM employeedb.users WHERE user_id=?', [decoded.id] ,(err, result)=>{
                if (err) throw err;
                else if(result.length>0)
                {
                    admin = result[0].is_admin; 
                    if(admin==1){
                        //console.log(admin); 
                        return next();
                        
                    }
                    else if(admin==0) {
                        res.render('api/login', {loginMsg: 'Please login to Adminstrator acount'});
                    }                    
                // return next(); 
                }
                else{
                    return next(); 
                }
                req.user = result[0];
                // 
            })
        } catch (error) {
            console.log(error);
            return next(); 
        }
    } else if (!(req.cookies.jwt)){
        res.render('api/login', {loginMsg: 'Please login to authorized acount'});
        //next(); 
    } else {
        next(); 

    }
} 

exports.isloggedIn= async(req, res, next) => {
    //console.log(req.cookies); 
    // let privateKey = 'kabul@123@kaBulJnTuH';
    if(req.cookies.jwt){
        try {
            // 1) verifying that token exits 
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
            //console.log(decoded); 
            // 2) check the user still exits 
            myconn.query('SELECT * FROM employeedb.users WHERE user_id=?', [decoded.id] ,(err, result)=>{
                if (err) throw err;
                else if(result.length>0)
                {
                    console.log()
                }
                else{
                    return next(); 
                }

                req.user = result[0];
                return next(); 
            })
        } catch (error) {
            console.log(error);
            return next(); 
        }
    } else if (!(req.cookies.jwt)){
        res.render('api/login', {loginMsg: 'Please login to authorized acount'});
        //next(); 
    } else {
        next(); 

    }
} 

exports.logout = (req, res) => {
    res.cookie('jwt','logout' , {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
    res.redirect('/');
}
