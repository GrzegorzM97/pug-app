var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');
var moment = require('moment');


var app = express();
// app.use(express.urlencoded());

app.locals.moment = moment;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
	host: 'localhost',
	user: 'node4',
	password: 'node4',
	database: 'node4',
	port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/', function(req, res){
	// res.end('hello khdskgf');
	res.render('start');
});

app.get('/list', function(req, res){
	// var coursesList =[
	// 	{name: 'WebApp',note: '3'},
	// 	{name: 'Java',note: '4'},
	// 	{name: 'DB',note: '4.5'}
	// ];
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM courses', function(err,rows){
			var coursesList =rows;
			res.render('list',{coursesList:coursesList});
			//res.end(coursesList)
		});
	});
});

app.get('/add', function(req, res){
	res.render('add');
});
app.post('/add', function(req, res){
	var cours={
		name: req.body.name,
		note: req.body.note,
		author: req.body.author,
		completion_date: req.body.completion_date
	}
	if(cours.name==''){
		var message='Podaj nazwę';
		res.render('add',{message:message});
		return;
	}
	console.log(cours)
	req.getConnection(function(error, conn){
		conn.query('INSERT INTO courses SET ?',cours, function(err,rows){
			if (err) {
				var message='Wystąpił błąd';
			}else{
				var message='Dodano';
			}
			res.render('add',{message:message});
		});
	});
});

app.get('/edit/(:id)', function(req, res){
	var idcours=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM courses WHERE id='+idcours, function(err,rows){
			res.render('edit',{
				id: idcours,
				name: rows[0].name,
				note: rows[0].note,
				author: rows[0].author,
				completion_date: rows[0].completion_date

			});
		});
	});
});

app.post('/edit/(:id)', function(req, res){
	var idcours=req.params.id;
	var cours={
		name: req.body.name,
		note: req.body.note,
		author: req.body.author,
		completion_date: req.body.completion_date
	}
	req.getConnection(function(error, conn){
		conn.query('UPDATE courses SET ? WHERE id='+idcours, cours, function(err,rows){
			if (err) {
				var message='Wystąpił błąd';
			}else{
				var message='Zmieniono';
			}
			res.render('edit',{
				id: idcours,
				name: req.body.name,
				note: req.body.note,
				author: req.body.author,
				completion_date: req.body.completion_date,
				message:message
			});
		});
	});
});

app.get('/delete/(:id)', function(req, res){
	var idcours=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM courses WHERE id='+idcours, function(err,rows){
			res.render('delete',{
				id: idcours,
				name: rows[0].name
			});
		});
	});
});
app.post('/delete/(:id)', function(req, res){
	var idcours=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('DELETE FROM courses WHERE id='+idcours, function(err,rows){
			if (err) {
				var message='Wystąpił błąd';
			}else{
				var message='Usunięto';
			}
			res.render('delete',{
				id: idcours,
				message:message
			});
		});
	});
});
app.listen(4000);