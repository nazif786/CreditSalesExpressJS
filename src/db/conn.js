const mysql = require('mysql2'); 
// const dotenv = require('dotenv');
// dotenv.config(); 


// conection to mysql database 

const mysqlConnection = mysql.createConnection({
    host: process.env.HOST, 
    user: 'root',
    // user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    port: process.env.DB_PORT,
    multipleStatements: true
}); 
mysqlConnection.connect((err)=>{
    if (err) {
        throw err; 
    }else{
        console.log("SQLServer conection succeseded..."); 
    }
}); 
module.exports=mysqlConnection;