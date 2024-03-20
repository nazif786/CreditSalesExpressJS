const express = require('express');
const myconn = require('../db/conn');
const pic_upload = express.Router();
const multer  = require('multer');
const path = require('path');
const authController = require('./auth');
const mysqlConnection = require('../db/conn');

let data;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/invoice_images')
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

pic_upload.get('/api/pictureUpload', (req, res)=>{
    let q = `SELECT * FROM employeedb.purchases ORDER BY p_id DESC LIMIT 1;`
    myconn.query(q,(err, result)=>{
        if (err) throw err
        else{
            if (result.length>0){
                res.render('api/pictureUpload', {saleData: result,  formpic:true, user:req.user})
                data = result[0];
            }
        }
    })
});

pic_upload.post('/api/upload_Pic',upload.single('invoice_img'), authController.isloggedIn,(req, res) => {
    
    let img = req.file; 
    let invoice_img = req.body.invoice_img; 
    let m = img.path; 
    // console.log(data)
    let {p_id, comp_id, p_reciept_no, p_date, pic_remarks} = data; 
    // console.log(img); 
    
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // console.log(date)
    let query = `INSERT INTO employeedb.invoice_pictures   
    (p_id, comp_id, pic_date, pic_invoice_date, pic_invoice_no, remarks, pic_image) 
    VALUES (?, ?, ?, ?, ?, ?, ?);`
    myconn.query(query, [p_id, comp_id, date, p_date, p_reciept_no, pic_remarks, m], (err, results)=>{
        if (err) throw err.message
        else {
            res.render('api/pictureUpload.hbs', {msg_pic: true, msg: false,user:req.user})
        }
    }); 
}); 
// pic_upload.get('/api/upload_Pic', (req, res) => { 
//     res.render('api/upload_Pic')
// });
pic_upload.post('', (req, res) => { });

module.exports = pic_upload; 
