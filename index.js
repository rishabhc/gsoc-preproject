var express = require('express');
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

var app = express();

app.set('port', process.env.PORT || 3000);
app.engine('handlebars',handlebars.engine);

app.set('view engine','handlebars');

app.use(express.static('/public'));

app.get('/',function(req,res){
	res.render('home');
});

app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

app.listen(app.get('port'),function(){
	console.log("Listening");
});

