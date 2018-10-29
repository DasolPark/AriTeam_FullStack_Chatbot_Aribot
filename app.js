var app = require('./config/mysql/express')();//함수니까 ()도 쓰는게 정석
var passport = require('./config/mysql/passport')(app);
var static = require('serve-static');
var path = require('path');
app.use('/public', static(path.join(__dirname, 'public')));

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic/', topic);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/welcome', function(req, res){
	res.sendFile(__dirname + '/public/welcome.html');
});

app.get('/adminMenu', function(req, res){
	res.sendFile(__dirname + '/public/adminFood.html');
});

var Schema = require('./config/mongodb/db')();
var CafeteriaModel = require('./config/mongodb/cafeteria')(Schema);

app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
