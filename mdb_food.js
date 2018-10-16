var mongoose = require('mongoose'); //mongoose module 불러오기
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var static = require('serve-static');
var router = express.Router();

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/', router);

var database;
var CafeteriaSchema;
var CefeteriaModel = {};

router.route('/process/addMenu').post(function(req, res) {
  console.log('/process/addMenu 호출됨.');

  // 요청 파라미터 확인
  var paramDate = req.body.fdate;
  var paramPart = req.body.fpart;
  var paramMenu = req.body.fmenu;

  addMenu(database, paramDate, paramPart, paramMenu);
});

function addMenu(database, paramDate, paramPart, paramMenu){
  var cafeteria = new CafeteriaModel({"data":paramDate, "part":paramPart, "menu":paramMenu});

  // save()로 저장
  cafeteria.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }

    console.log("메뉴 추가함.");
    callback(null, user);
  });
}

function connectDB() {
  // 데이터베이스 연결 정보
  var databaseUrl = 'mongodb://localhost:27017/local';

  // 데이터베이스 연결
  console.log('데이터베이스 연결을 시도합니다.');
  mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function () {
    console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

    // user 스키마 및 모델 객체 생성
    createCafeteriaSchema();
  });

  // 연결 끊어졌을 때 5초 후 재연결
  database.on('disconnected', function() {
    console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
    setInterval(connectDB, 5000);
  });
}

function createCafeteriaSchema() {

  // 스키마 정의
  CafeteriaSchema = mongoose.Schema({
    date: {type: Number},
    part: {type: String, default: 0},
    menu: {type: String, default: 0},
  });

  console.log('CafeteriaSchema 정의함.');

  // CafeteriaModel 모델 정의
  CafeteriaModel = mongoose.model("Cafeteria", CafeteriaSchema);
  console.log('Cafeteria 정의함.');
}

http.createServer(app).listen(3000, function(){
  console.log('서버가 시작되었습니다. 포트 : ' + '3000');

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
});