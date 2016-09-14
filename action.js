var express = require('express');
var app = express();
var HTML_PATH = '/node/shuaibabi/html/';

app.use(express.static('public'));

app.get('/',function(req,res){
	console.log(new Date().toString() + req.ip + '访问了你');
	res.sendFile(HTML_PATH + 'index.html');
});


app.get('*',function(req,res){
	res.sendFile(HTML_PATH + '404.html');
});

app.listen('8080',function(){
	console.log('--server start--');	
});