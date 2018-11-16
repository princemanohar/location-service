var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "prince",
    password: "abcd",
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE dev3", function(err, result) {
        if (err) console.log(err);
        console.log("Database created");
        var sql = `create table dev3.CityLocationData
(
Address varchar(512),
latitude float,
longitude float,
queried_at DATETIME DEFAULT CURRENT_TIMESTAMP 
);`;
        con.query(sql, function(err, result) {
            if (err) console.log(err);
            console.log("Table created");

            return
        });
    });
});

exports.getConn = function(){
	return con;
}