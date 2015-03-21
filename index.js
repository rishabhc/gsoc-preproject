var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

var app = express();

app.set('port', process.env.PORT || 3000);

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
	
app.get('/',function(req,res){
	res.render('home');
});

app.post('/create',function(req,res){
	var filename = 'schema/'+req.body.filename+'.json';
	fs.exists(filename,function(exists){
		if(!exists) {
			fs.appendFile(filename,JSON.stringify({'val':40}));
			res.end("File " + req.body.filename+".json created.");
		}
		else {
			res.end("File " +req.body.filename+".json already exists.");
		}
	});
});

app.post('/update/:file/:val',function(req,res){
	var filename = 'schema/'+res.body.file+'.json';
	console.log(filename);
	fs.exists(filename,function(exists){
		if(exists) {
			var file = require(filename);
			file.val = req.val;
			fs.writeFile(filename, JSON.stringify(file), function (err) {
			  if (err) return console.log(err)
			  console.log(JSON.stringify(file));
			  console.log('writing to ' + filename);
			});
			res.send('updated');
		}
		else {
			res.send("File " + res.file + " does not exist.")
		}
	});
});

app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

app.listen(app.get('port'),function(){
	console.log("Listening");
});