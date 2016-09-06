var express = require('express');
var app = express();
var HTML_PATH = '/node/myWeb/html/';

app.use(express.static('public'));

app.get('/',function(req,res){
	console.log(new Date().toString() + req.ip + '访问了你');
	res.sendFile(HTML_PATH + 'index.html');
})


app.listen('8080',function(){
	console.log('--server start--');	
})