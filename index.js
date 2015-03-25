var express = require('express');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var url = require('url');
var jsonql = require('./jsonql');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

var app = express();

app.set('port', port);

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
					res.send(data);
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

app.get('/update/:file',function(req,res){
	var filename = './schema/'+req.params.file+'.json';
	console.log(filename);
	fs.exists(filename,function(exists){
		if(exists) {
			var file = require(filename);
			var url_parts = url.parse(req.url,'true');
			var query = url_parts.query;

			//merging json objects, to be exported to another function 
			var newFile={};
			for(var key in file) newFile[key]=file[key];
			for(var key in query) newFile[key]=query[key];
			
			fs.writeFile(filename, JSON.stringify(newFile), function (err) {
			  if (err) return console.log(err)
			  res.send('Updated file: ' + JSON.stringify(newFile));
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
				res.send('File '+ req.body.filename + ' deleted successfully');
			})
		}
		else {
			res.send('File ' + filename + ' does not exist.');
		}
	});
});

app.post('/secret',function(req,res){
	var userName = req.body.name;
	var dirname = './schema/'+userName;
	fs.lstat(dirname,function(err,stats){
		if(err) {
			fs.mkdir(dirname,function(e){
				if(e)
					res.send({error:true,message:"Some error occured, please try again!"});
				else {
					var genToken = jwt.sign({name:userName},'microdb');
					res.send({error:false,token:genToken,message:"Token generation successful"});
				}
			});
		}
		else {
			if(stats.isDirectory()) {
				 var response = {error:true,message:"The username already exists!"};
				res.send(response);
				}
				else 
					res.send({error:true,message:"An unkown error occured, please try again."});
			}
	});
});

app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

app.listen(app.get('port'),function(){
	console.log("Listening on " + app.get('port'));
});
