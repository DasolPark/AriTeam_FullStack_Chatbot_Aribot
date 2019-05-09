module.exports = function(){
  var express = require('express');
  var session = require('express-session');//메모리에만 저장
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  var app = express();
  app.set('views', './views/mysql');
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: false}));
  app.use(bodyParser.json());

  app.use(session({
    secret: '1234SADF@#%fdjgkl',//session id를 심을 때, 키같은 것
    resave: false,//세션id를 새로 접속할 때마다 재발급하지 않는다
    saveUninitialized: true,//세션을 id를 세션을 실제로 사용하기 전까지는 발급하지 말아라
    store: new MySQLStore({
    	host: '0.0.0.0',
      port: 3306,
      user: 'root',
      password: 'ari610',
      database: 'o2'
    })
  }));

  return app;
}
