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
var CafeteriaModel;
/*
app.get('/manager', function(req, res){
  res.send('/publid/FoodMenuSuccess.html');
});*/
router.route('/process/addMenu').post(function(req, res) {
  console.log('/process/addMenu 호출됨.');

  var paramDate = req.body.fdate;
  var paramPart = req.body.fpart;
  var paramMenu = req.body.fmenu;

  addMenu(database, paramDate, paramPart, paramMenu);
  res.redirect('/process/addSuccess');
});
app.post('/process/addSuccess', function(req, res){
  var output = `
  <h1>메뉴가 추가되었습니다.</h1>
  <h3>${paramDate}</h3>
  <a href="/public/FoodMenu.html">메뉴추가 화면으로 돌아가기</a>
  `;
  res.send(output);
});

function addMenu(database, paramDate, paramPart, paramMenu){//database 빼기
  var cafeteria = new CafeteriaModel({
    "date":paramDate,
    "part":paramPart,
    "menu":paramMenu}
    );

  // save()로 저장
  cafeteria.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(paramDate+ ', '+paramPart+ ', '+ paramMenu+ 'document 추가되었습니다.');
    // console.log('mongoexport --db local --collection cafeterias --out C:\\dev\\output.json --jsonArray --pretty');
  });
}
/* add deleteOne */
router.route('/process/delMenu').post(function(req, res) {
  console.log('/process/delMenu 호출됨.');

  // 요청 파라미터 확인
  var paramDate = req.body.fdate;
  var paramPart = req.body.fpart;

  delMenu(database, paramDate, paramPart);
  res.redirect('/process/delSuccess');
});
app.get('/process/delSuccess', function(req, res){
  var output = `
    <h1>del Success</h1>
    <a href="/public/FoodMenu.html">메뉴 추가로 돌아가기</a>
    `;
  res.send(output);
});

function delMenu(database, paramDate, paramPart, callback) {//paramdate, parampart 를 이용해 삭제
  console.log('delMenu 호출됨.');
  //메뉴 번호를 입력하면 해당 메뉴의 도큐먼트만 삭제되도록 할 것  
  database.cafeteriaModel.remove({"date":paramDate, "part":paramPart});
  cafeteria.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(paramDate+ ', '+paramPart+ 'document 삭제됨');
    callback(null, cafeteria);
  });
}
/*
//list 보여주기
app.get("/process/showlist", function(request, response){
  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
    }else{
      var sql="select * from member2 order by member2_id asc";

      con.query(sql, function(err, result, fields){
        if(err){
          console.log(err);
        }else{
          console.log(result);
          response.writeHead(200, {"Content-Type":"text/html"});
          response.end(JSON.stringify(result));
        }
      });
    }
  });
});
function getList(){
  $.get("/process/listmenu", function(data, status){
    var array=JSON.parse(data);
    var str="<table width='100%' border='1px'>";
        str=str+"<tr>";
        str=str+"<td>member2_id</id>";
        str=str+"<td>id</td>";
        str=str+"<td>pw</td>";
        str=str+"<td>name</td>";
        str=str+"</tr>";
    for(var i=0; i<array.length; i++){
      var obj=array[i];
      
      str=str+"<tr onClick=\"getDetail("+obj.member2_id+")\">";
      str=str+"<td>"+obj.member2_id+"</id>";
      str=str+"<td>"+obj.id+"</td>";
      str=str+"<td>"+obj.pw+"</td>";
      str=str+"<td>"+obj.name+"</td>";
      str=str+"</tr>";
    }
    str=str+"</table>";

    $("#list_area").empty();
    $("#list_area").append(str);
  });
}
*/
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