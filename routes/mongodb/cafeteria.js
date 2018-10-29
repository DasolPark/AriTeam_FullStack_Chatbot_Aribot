module.exports = function(CafeteriaModel){
  var app = require('express').Router();
  var fs = require('fs');
  var path = require('path');

  app.get('/food/admin', function(req, res){
    res.sendFile(path.join(__dirname, '../../public', 'adminFood.html'));
  });
  //메뉴 추가 라우터
  app.post("/food/add", function(req, res){
    console.log('/food/add 호출되었음.');

    var paramDate = req.body.date;
    var paramPart = req.body.part;
    var paramMenu = req.body.menu;

    addFood(paramDate, paramPart, paramMenu);
    console.log('Add Food Success!');
  });
  ////메뉴 추가 함수
  function addFood(paramDate, paramPart, paramMenu){
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
  app.get("/food/list", function(req, res){
    console.log('/food/list 호출되었음.');
    listFood(req, res);
    console.log('List Food Success');
  });
  //메뉴 읽기 함수
  function listFood(req, res) {
    CafeteriaModel.find({}, function(err, cafeterias){
      console.log('cafeterias.length: '+cafeterias.length);

      number = cafeterias.length;
      const file = './uploads/MenuList.json'
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
  app.post("/food/del", function(req, res){
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
  app.post("/food/delAll", function(req, res){
    CafeteriaModel.deleteMany({}, function(err, cafeterias){
        if(err) {
          console.err(err);
        } else {
          console.log('document가 전체 삭제되었습니다.');
        }
    });
  });
  return app;
}
