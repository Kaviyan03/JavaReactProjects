const mysql = require("mysql2");

const con = mysql.createConnection({
    host : "localhost",
    port : 3306,
    database : "mobilestoredb",
    user : "root",
    password : "@Revathi1978"

});

con.connect(err =>{
    if(err) throw  err;
    console.log("connected");

    const sql = "select * from mobile_tbl";
    con.query(sql, (err,result)=>{
        if (err) throw err;
        console.log(result);
        con.end();
    })

})