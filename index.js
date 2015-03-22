var express = require('express');
var fs = require('fs');
var jsonql = require('jsonql');
var bodyParser = require('body-parser');
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

var app = express();

app.set('port', process.env.PORT || 3000);

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
	
app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
	res.render('home');
});

app.get('/read/:file',function(req,res){
	var filename = './schema/'+req.params.file+'.json';
	fs.exists(filename,function(exists){
		if(exists) {
			fs.readFile(filename,'utf-8',function(err,data){
				if (err) res.send(err);
					res.send(JSON.parse(data));
			});
		}
		else {
			res.send('The requested file does not exist');
		}
	});
});

app.get('/read/:file/:query',function(req,res){
	var filename = './schema/'+req.params.file+'.json';
	fs.exists(filename,function(exists){
		if(exists) {
			fs.readFile(filename,'utf-8',function(err,data){
				if (err) res.send(err);
				res.send(JSON.stringify(jsonql(req.params.query,JSON.parse(data))));
			});
		}
		else {
			res.send('The requested file does not exist');
		}
	});
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
	var filename = './schema/'+req.params.file+'.json';
	console.log(filename);
	fs.exists(filename,function(exists){
		if(exists) {
			var file = require(filename);
			file.val = req.params.val;
			fs.writeFile(filename, JSON.stringify(file), function (err) {
			  if (err) return console.log(err)
			  res.send('Updated file ' + filename);
			});
		}
		else {
			res.send("File " + res.file + " does not exist.")
		}
	});
});

app.post('/delete',function(req,res){
	var filename = './schema/'+ req.body.filename + '.json';
	fs.exists(filename,function(exists){
		if(exists) {
			fs.unlink(filename,function(err){
				if(err)
					res.send("Something went wrong!");
				res.send(filename + ' deleted successfully');
			})
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