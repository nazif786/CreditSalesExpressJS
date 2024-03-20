const express = require('express');
const myconn = require('../db/conn');
const routs = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('./auth')



routs.get('/', authController.isloggedIn,(req, res) => {
    res.render("index",{
        user:req.user
    })
});

routs.get('/gallery',authController.isloggedIn, (req, res) => {
    res.render('gallery')
});
routs.get('/help', (req, res) => {
    res.render('help')
});
routs.get('/overview', (req, res) => {
    res.render('overview')
});
routs.get('/logs', authController.isloggedIn,authController.isAdmin,(req, res) => {
    res.render('logs',{user: req.user})
});
routs.get('/api/login', (req, res)=>{
    res.render('api/login'); 
})

routs.get('/api/logout', authController.logout, (req, res)=>{
    res.render('api/logout'); 
})
// Sales and Purcahse routsreq.accepts(types);
routs.get('/api/newSale',authController.isloggedIn, (req, res) => {
    res.render('api/newSale', {
        newS: true,
        user: req.user
    });
});

routs.get('/api/salesReports',authController.isloggedIn, (req, res) => {
    res.render('api/salesReports', {
        user: req.user
    });
});

routs.get('/api/newPurchase',authController.isloggedIn, (req, res) => {
    res.render('api/newPurchase', {
        user: req.user,
        newP:true
    });
});
routs.get('/api/purchaseReports',authController.isloggedIn, (req, res) => {
    res.render('api/purchaseReports', {
        user: req.user
    });
});


// Employees routs 
routs.get('/api/newEmployee',authController.isAdmin, (req, res) => {
    res.render('api/newEmployee', {
        user: req.user
    });
});
routs.get('/api/employeesReport',authController.isloggedIn, (req, res) => {
    res.render('api/employeesReport', {user:req.user});
});
routs.get('/api/employees',authController.isloggedIn, (req, res) => {
    res.render('api/employees', {user:req.user});
});

//Customer routs 
routs.get('/api/customer',authController.isloggedIn, (req, res) => {
    res.render('api/customer', {user:req.user});
});
routs.get('/api/newCustomer',authController.isloggedIn, (req, res) => {
    res.render('api/newCustomer', {user:req.user});
});
routs.get('/api/customersReport',authController.isloggedIn, (req, res) => {
    res.render('api/customersReport', {user:req.user});
});
// Company routs
routs.get('/api/company',authController.isloggedIn, (req, res) => {
    res.render('api/company', {user:req.user});
});
routs.get('/api/newCompany',authController.isloggedIn, (req, res) => {
    res.render('api/newCompany', {user:req.user});
});
routs.get('/api/companyReport',authController.isloggedIn, (req, res) => {
    res.render('api/companyReport', {user:req.user});
});
routs.get('/api/newCompanyContact',authController.isloggedIn, (req, res) => {
    res.render('api/newCompanyContact', {user:req.user});
});

//user routs 
routs.get('/api/user',authController.isloggedIn, (req, res) => {
    res.render('api/user', {user:req.user});
});
routs.get('/api/newUser', (req, res) => {
    res.render('api/newUser');
});
routs.get('/api/userReport', authController.isAdmin,(req, res) => {
    res.render('api/userReport', {user:req.user});
});

routs.get('/api/loginPage', (req, res) => {
    res.render('api/login');
});
routs.get('/api/passwordRecover', (req, res)=>{
    res.render('api/passwordRecover');
})

routs.get('/api/profile',authController.isloggedIn ,(req, res) => {
        res.render('api/profile', {
            user: req.user
        });
});


// add new employee
routs.post('/api/addnewemployee', [
    body('tazkira_id').not().isEmpty().trim().escape().withMessage('Tazkira Number can not be empty'),
    body('tazkira_id').isInt().withMessage('Tazkira Number can not contain alphabets or special charactors'),

    body('fname').not().isEmpty().trim().escape().withMessage('First Name can not be empty'),
    body('lname').not().isEmpty().trim().escape().withMessage('Last Name can not be empty'),
    body('father_name').trim().escape(),
    body('mobile').not().isEmpty().trim().escape().withMessage('Mobile Number can not be empty'),
    body('mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('email').not().isEmpty().withMessage('Email ID can not be empty'),
    body('email').isEmail().normalizeEmail().withMessage('Please Enter Valid Email ID')
], (req, res) => {
    // fetching data from form 
    // res.send(req.query);  {}, fname, lname, father_name, mobile, email, address, status }
    const tazkira_id = req.body.tazkira_id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const father_name = req.body.father_name;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    const status = req.body.status;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/newEmployee', { alerts });
    } else {
        let qry = "SELECT * FROM employees WHERE mobile=? or email=? or tazkira_id=?";
        myconn.query(qry, [mobile, email, tazkira_id], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                if (result.length > 0) {
                    // message if mobile no or email aleady exists 
                    res.render('api/newEmployee', { chmsg: true });
                    console.log(result)
                } else {
                    // insent qeury 
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    let qryInsertEmp = "INSERT INTO employees (`tazkira_id`, `fname`, `lname`, `father_name`, `mobile`, `email`, `address`, `reg_date`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    myconn.query(qryInsertEmp, [tazkira_id, fname, lname, father_name, mobile, email, address, date, status], (err, results) => {
                        if (err)
                            throw err;
                        else {
                            if (results.affectedRows > 0) {
                                res.render('api/employees', { msg: true });
                            }
                        }
                    });
                }
            }
        });
    }

});

// searching employee routing 
routs.post('/api/searchEmp', authController.isAdmin, [
    body('fname').not().isEmpty().trim().escape().withMessage('Please enter emplayee name or id'),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/employees', { alerts });
    }
    else {
        const { fname } = req.body;
        let searchQueryEmp = "SELECT * FROM employees WHERE fname=? or id=?";
        myconn.query(searchQueryEmp, [fname, fname], (err, result) => {
        if (err)
            throw err
        else {
            if (result.length > 0) {
                res.render('api/employees', { empSaerchFound: true, empSaerch: false, data: result ,user: req.user});
            } else {
                res.render('api/employees', { empSaerchFound: false, empSaerch: true,user: req.user });
            }
        }
    });
    }
    
});
// update employee record 
routs.post('/api/updateemployee', authController.isAdmin,[
    body('tazkira_id').not().isEmpty().trim().escape().withMessage('Tazkira Number can not be empty'),
    body('tazkira_id').isInt().withMessage('Tazkira Number can not contain alphabets or special charactors'),

    body('fname').not().isEmpty().trim().escape().withMessage('First Name can not be empty'),
    body('lname').not().isEmpty().trim().escape().withMessage('Last Name can not be empty'),
    body('father_name').trim().escape(),
    body('mobile').not().isEmpty().trim().escape().withMessage('Mobile Number can not be empty'),
    body('mobile').isMobilePhone().withMessage('Enter valid mobile number'),
    body('email').not().isEmpty().withMessage('Email ID can not be empty'),
    body('email').isEmail().normalizeEmail().withMessage('Please Enter Valid Email ID')
], (req, res) => {
    // update employee Record 
    const id = req.body.id; 
    const tazkira_id = req.body.tazkira_id;
    const mobile = req.body.mobile;
    const email = req.body.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/employees', { alerts });
    } 
    else 
    {
        let qry = "SELECT * FROM employees WHERE (mobile=? or email=? or tazkira_id=?) and id=?";
        myconn.query(qry, [mobile, email, tazkira_id, id], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            if (result.length > 0) {
                // message if mobile no or email aleady exists 
                res.render('api/employees', { msg_data_exist: true , user: req.user});
            } else {
                    const {id,tazkira_id, fname, lname, father_name, mobile, email, address, status } = req.body; 
                    let updateQueryEmp = "UPDATE employees SET tazkira_id=?, fname=?,lname=?,father_name=?,mobile=?,email=?,address=?, status=? WHERE id=?"; 
                    myconn.query(updateQueryEmp, [tazkira_id, fname, lname, father_name, mobile, email, address, status, id], (err, result) => {
                        if(err)
                        throw err 
                        else {
                            if (result.affectedRows > 0){
                                res.render('api/employees', {updatemsg: true ,user: req.user}); 
                            }
                        }
                    });
            }
        }
    });
    }


    
});
// search emp to delete data 
routs.post('/api/delemp', authController.isAdmin, [
    body('fname').not().isEmpty().trim().escape().withMessage('Please enter emplayee name or id'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alerts = errors.array();
        res.render('api/employees', { alerts });
    }
    else {
        const { fname } = req.body;
        let searchQueryEmp = "SELECT * FROM employees WHERE fname=? OR id=?";
        myconn.query(searchQueryEmp, [fname, fname], (err, result) => {
            if (err)
                throw err
            else {
                if (result.length > 0) {
                    res.render('api/employees', { empdelFound: true, empdel: false, data: result ,user: req.user });
                } else {
                    res.render('api/employees', { empdelFound: false, empdel: true ,user: req.user });
                }
            }
        });
    }

    
});
// delete employee record 
routs.post('/api/deleteemployee', authController.isAdmin,(req, res) => {
    // delete employee 
    const { fname } = req.body;
    let delQueryEmp = "DELETE FROM employees WHERE fname=?";
    myconn.query(delQueryEmp, [fname], (err, result) => {
        if (err)
            throw err
        else {
            if (result.affectedRows > 0) {
                res.render('api/employees', { delrecord: true ,user: req.user });
            }
        }
    });
});
// show all employee records  
routs.get('/api/showall',authController.isAdmin, (req, res) => {
    let SelectQueryEmp = "SELECT * FROM employees";
    myconn.query(SelectQueryEmp, (err, results) => {
        if (err)
            throw err
        else {
            r = results;
            console.log()
            for (let i of r) {
                console.log(i.reg_date)
                let reg_date2 = i.reg_date;  
                i.reg_date = reg_date2.getFullYear() + '/' + (reg_date2.getMonth() + 1) + '/' + reg_date2.getDate();                       
            }
            res.render('api/employees', { data2: r ,user: req.user });
        }
    });
});



// export routs 
module.exports = routs; 
