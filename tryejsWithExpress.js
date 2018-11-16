let fs = require('fs');
let request = require('request');
var express = require('express');
let ejs = require('ejs');
var app = express();
app.set('view engine', 'ejs');
var url = require('url');
var db = require('./init_db');


conn = db.getConn();


let port_no = 8080
app.listen(port_no);
console.log("App started on "+port_no)
// Defining the Routes

app.get('/coordinates/history', function(req, res) {
  
  conn.query('SELECT * FROM dev1.citylocationdata order by queried_at desc; ', function(err, rows, fields)
        {   
				if (err) throw err;
                
				res.writeHead(200, { 'Content-Type': 'text/html '});
		
				//var rows = JSON.stringify(rows); 
				console.log(rows)
				renderHtml1(rows, res, "History");
			  

        });

});

app.get('/index', function(req, res){
	renderHtml1([], res,"")
});

app.get('/coordinates', function(req, res) {
  
 
  var q = require('url').parse(req.url, true);
  var query = q.query;
  address = query['address']

  apiKey = '7953321e059f79ab8daddf050c72988c';
  city = address;
  url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
 
 
  request(url, function (err, weatherResp, body) {
  if(err){
    console.log('error:', err);
  } else {
	  let resp = JSON.parse(body)
	  console.log(resp)

	  if (resp['cod']==404 || resp['cod']==400 ){
		  //latlon = { "Address":city,"latitude":0, "longitude":0 }
		  //rows = [latlon]
		  renderHtml1([], res, "Enter a Valid City")
		  
	  }else{
		  latlon = { "Address":city,"latitude":`${resp.coord.lat}`, "longitude":`${resp.coord.lon}` }
		  rows = [latlon]
		res.writeHead(200, { 'Content-Type': 'text/html '});
	
		renderHtml1(rows, res, "Your City Result")
	
		updateHistory(latlon)
	
	}
	  
	  
	
	
	
  }
});

  
});

let renderHtml1 = function(rws, resp, title){
	fs.readFile('index1.html', 'utf-8', function(err, content) {
    if (err) {
      res.end('error occurred');
      return;
    }
	var renderedHtml = ejs.render(content, {rows:rws, heading:title});
	console.log(renderedHtml)
	resp.end(renderedHtml);
	});
}

let updateHistory = function (row){
	
	sql = `insert into dev1.CityLocationData (Address,latitude,longitude) values ('${row.Address}', ${row.latitude}, ${row.longitude})`;
	
	console.log("Inserting : "+sql)

	conn.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Result: " + result);
	  });
	
}
