var app = require('../../config/mysql/express')();
var Schema = require('../../config/mongodb/db.js')();
var CafeteriaModel = require('../../config/mongodb/cafeteria')(Schema);
var fs = require('fs');//메뉴를 JSON파일로 바꿔주기 위한 모듈 불러옴
var jsonfile = require('jsonfile');

////메뉴 추가 함수
function addMenu(paramDate, paramPart, paramMenu){
    console.log('메뉴 번호는 '+ number+ '부터 시작합니다.');
    var cafeteria;

    cafeteria = new CafeteriaModel({
        'date':paramDate,
        'part':paramPart,
        'menu':paramMenu
    });

    cafeteria.save(function(err) {
      if (err) {
        console.log(err);
      }
      console.log(paramDate+ ', '+paramPart+ ', '+ paramMenu+ 'document 추가되었습니다.');
    });
}
////메뉴 읽기
app.get("/process/listMenu", function(req, res){
  console.log('/process/listMenu 호출되었음.');
  listMenu(req, res);
  console.log('List Menu Success');
});
//메뉴 읽기 함수
function listMenu(req, res) {
  CafeteriaModel.find({}, function(err, cafeterias){
    console.log('cafeterias.length: '+cafeterias.length);

    number = cafeterias.length;
    const file = './uploads/menuList.json'
    const list = cafeterias;

    jsonfile.writeFile(file, {list}, function(err){
      if(err) console.log(err);
    });
    if (err) {
      callback(err, null);
      return;
    } else {
      res.writeHead(200, {"Content-Type":"text/html"});
      res.end(JSON.stringify(cafeterias));
    }
  });
}
////메뉴 삭제
app.post("/process/delMenu", function(req, res){
  var paramNum = req.body.number;

  CafeteriaModel.findOneAndDelete({
    'number': paramNum
    }, function(err, cafeterias){
      if(err) {
        console.log(err);
      } else {
        console.log(paramNum+'번 document가 삭제되었습니다.');
      }
  });
});
//메뉴 전체 삭제
app.post("/process/delAllMenu", function(req, res){
  CafeteriaModel.deleteMany({}, function(err, cafeterias){
      if(err) {
        console.err(err);
      } else {
        console.log('document가 전체 삭제되었습니다.');
      }
  });
});
