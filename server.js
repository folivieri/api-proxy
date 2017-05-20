var express = require('express'),
	app = express(),
	fs = require("fs"),
	bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/listUsers', function (req, res) {
	 console.log( "dirName: " + __dirname );
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})


app.post('/updateUsers', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["payrollDetails"] = req.body.payrollDetails;
       console.log( data );
       res.end( JSON.stringify(data, null, 2));
   });
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
