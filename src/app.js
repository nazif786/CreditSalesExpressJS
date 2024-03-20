const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
// const session = require('express-session');
const hbs = require('hbs');
require('dotenv').config()
// const dotenv = require('dotenv');
const {check, validationResult} = require('express-validator');  
const paginate = require('handlebars-paginate');
var cookieParser = require('cookie-parser')

hbs.registerHelper('paginate', paginate);
// dotenv.config(); 

app.use(express.urlencoded({extended:true})); 
app.use(express.json()); 
app.use(cookieParser());

// app.use(session({
// 	secret: 'mobile credit',
// 	resave: true,
// 	saveUninitialized: true
// }));


const routs = require('./routs/main');
const logs_routs = require('./routs/logs');

const cust_routs = require('./routs/customer'); 
const comp_routs = require('./routs/comp'); 
const user_routs = require('./routs/user'); 
const sales_routs = require('./routs/sales'); 
const salesR_routs = require('./routs/salesReports'); 
const app2 = require('./routs/sales'); 
const purchase_routs = require('./routs/purchase'); 
const purchase_routsR = require('./routs/purchaseReports'); 
const pic_upload = require('./routs/pictureupload'); 
const login_rout = require('./routs/login')
// const auth_rout = require('./routs/auth')

app.use('/', routs);
app.use('/', logs_routs);

app.use('/', cust_routs); 
app.use('/', comp_routs); 
app.use('/', user_routs); 
app.use('/', sales_routs); 
app.use('/', salesR_routs); 
app.use('/', app2); 
app.use('/', pic_upload);
app.use('/', purchase_routs); 
app.use('/', purchase_routsR); 
app.use('/', login_rout); 
// app.use('/', auth_rout); 


// const Joi = require('joi'); 
const port =process.env.PORT || 50001  ;
// connection to db
const mysqlConnection = require('./db/conn');
const { urlencoded } = require('express');


// Static files setup
app.use('/static', express.static('public'));

// hbs configuration or Template Engine 
// or Set  Views or view Engine 
app.set('view engine', 'hbs');
app.set('views', 'views');
hbs.registerPartials('views/partials');


// Set Controllers   


// 
app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log(`server is running at port no http://localhost:${port}`)
}); 