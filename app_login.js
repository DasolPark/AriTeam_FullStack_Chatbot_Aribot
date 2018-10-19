/** login&authenticate&logout, register, welcome **/
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");//암호화 방식
var hasher = bkfd2Password();
var passport = require('passport');//인증 모듈
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var conn = mysql.createConnection({
	host	: 'localhost',//수정 필요
	user 	: 'root',
	password: '111111',
	database: 'o2'
});
conn.connect();

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

/** session **/
app.use(session({
  secret: '1234SADF@#%fdjgkl',//session id를 심을 때, 키같은 것
  resave: false,//세션id를 새로 접속할 때마다 재발급하지 않는다
  saveUninitialized: true,//세션을 id를 세션을 실제로 사용하기 전까지는 발급하지 말아라
  store: new MySQLStore({
  	host: 'localhost',//수정 필요
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'o2'
  })
}));
app.use(passport.initialize());
app.use(passport.session());//인증할 때 세션을 사용하겠다(반드시 app.use(session({})))뒤에 나와야한다

/** Login + Authentication + Logout**/
var auth = require('./routes/login')(conn, hasher, passport, LocalStrategy);
app.use('/auth', auth);

/** Welcome **/
var welcome = require('./routes/welcome');
app.use('/', welcome);

/** Register **/
var register = require('./routes/register')(hasher, conn);
app.use('/auth', register);

app.listen(3003, function(){//수정 필요
  console.log('Connected 3003 port!!!');
});