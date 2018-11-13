var app = require('./config/mysql/express')();//함수니까 ()도 쓰는게 정석
var passport = require('./config/mysql/passport')(app);
var static = require('serve-static');
var path = require('path');
var cors = require('cors');//다중접속을 위한 cors 추가
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');//add autoInc
var fs = require('fs');//메뉴를 JSON파일로 바꿔주기 위한 모듈 불러옴
var jsonfile = require('jsonfile');
var mysql = require('mysql');
app.use(cors());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

var pool=mysql.createPool({
	host:"localhost",//0.0.0.0
	user:"root",//root
	password:"111111",//ari610
	database:"o2"//o2
});
var CafeteriaModel;

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/welcome', function(req, res){
	if(req.user.username == "food"){
		res.sendFile(path.join(__dirname + '/public/adminFood.html'));
	}else if(req.user.username == "phone"){
		res.sendFile(path.join(__dirname + '/public/adminPhone.html'));
	}else if(req.user.username == "room"){
		res.sendFile(path.join(__dirname + '/public/adminRoom.html'));
	}
});

app.get('/room', function(req, res){
  res.sendFile(__dirname + '/public/adminRoom.html');
});

//Room 예약 리스트 요청
app.get("/room/list", function(req, res){
  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
    }else{
      var sql="select * from reservation";

      con.query(sql, function(err, result){
        if(err){
          console.log(err);
        }else{
					const file = './uploads/RoomRes.json'
					const list = result;

					jsonfile.writeFile(file, {list}, function(err){
						if(err) console.log(err);
					});
					if(err){
						console.log(err);
					} else {
          res.writeHead(200, {"Content-Type":"text/html"});
          res.end(JSON.stringify(result));
        	}
				}
        con.release();
			});
		}
	});
});
//Room 예약 삭제 요청
app.post("/room/del", function(req, res){
	var rkey = req.body.rkey;
  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
    }else{
      var sql="delete from reservation where rkey=?";
      con.query(sql, rkey, function(err, result){
        if(err){
          console.log(err);
        }else{
          res.writeHead(200, {"Content-Type":"text/html"});
          res.end(JSON.stringify(result));
				}
        con.release();
			});
		}
	});
});

app.get('/reservation', function(req, res){
  res.sendFile(__dirname + '/public/reservation.html');
});
app.post("/resAjax", function(req, res){
	console.log("클라이언트의 post전송을 받았습니다!!");
	console.log(req.body);
	var rDate=req.body.rDate;//날짜(일자, 요일 분리 필요)
	var rClass=req.body.rClass;//강의실
	var rNum=req.body.rNum;//호수
	var array=req.body.array;//배열
	var key = rDate+rClass+rNum+array;

  pool.getConnection(function(error, con){

    if(error){
      console.log(error);
		}else{
			console.log("접속 성공");

			var sql="select rkey from reservation where rkey = ?";
			con.query(sql, key, function(err, result){
				var reBool = true;
				console.log(key);
				if(result == ""){
					console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",key);
					reBool = false;
				}
				if(reBool){
					console.log(reBool);
					console.log(result, "등록 실패");
          res.end(JSON.stringify(reBool));
				}else{
					console.log(reBool);
					console.log(result, "등록 가능");
					res.writeHead(200, {"Content-Type":"text/html"});
					res.end(JSON.stringify(reBool));
				}
        con.release();
			});
		}
	});
});
//빈 강의실 예약 요청
app.post("/reservation/sub", function(req, res){
	console.log("클라이언트의 post전송을 받았습니다!!");
	console.log(req.body);
	var key=req.body.key;//날짜(일자, 요일 분리 필요)
	var stId=req.body.stId;//날짜(일자, 요일 분리 필요)

  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
		}else{
			console.log("접속 성공");

			var sql="insert into reservation(rkey,stId) values(?,?)";
			con.query(sql,[key,stId], function(err, result){
				console.log(result);
				console.log(result,key,stId);
				if(err){
					console.log(err, "등록 실패");
					res.end("Fail");
				}else{
					res.writeHead(200, {"Content-Type":"text/html"});
					res.end("OK");
				}
        con.release();
			});
		}
	});
});
app.post("/reservation/delete", function(req, res){
	console.log("클라이언트의 post전송을 받았습니다!!");
	console.log(req.body);
	var key=req.body.key;//날짜(일자, 요일 분리 필요)
	var stId=req.body.stId;//날짜(일자, 요일 분리 필요)

  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
		}else{
			console.log("접속 성공");
      //아래 데이터베이스 이름에 맞춰서 변경해주기
			var sql="delete from reservation where rkey = ? and stId = ?";
			con.query(sql,[key,stId], function(err, result){
			console.log("#############################################3");
				console.log(err);
				if(!result.affectedRows){
					console.log(err, "삭제 실패");
					res.end("Fail");
				}else{
					res.writeHead(200, {"Content-Type":"text/html"});
					res.end("OK");
				}
        con.release();
			});
		}
	});
});
//빈 강의실 조회 요청
app.post("/reservation/list", function(req, res){
	console.log(rDate+' '+rClass+' '+rNum+' '+rDay);
  var rDate=req.body.rDate;//날짜(일자, 요일 분리 필요)
  var rClass=req.body.rClass;//강의실
  var rNum=req.body.rNum;//호수
  var rDay=req.body.rDay;//요일
  console.log(rDate+ " " + rClass);
  var resultData = {};

  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
    }else{
      var sql="select number, substring_index(substring_index(timeTable, '"+rDay+"(', -1), ')', 1) as timeTable from (select number, timeTable from (select number,timeTable from (select number, timeTable from lecture2 where timeTable like '%"+rClass+"%') as leca where leca.timeTable like '%"+rNum+"%') as lecb where lecb.timeTable like '%"+rDay+"%') as lecc";
      con.query(sql, function(err, result){
        if(err){
          console.log(err);
        }else{
          // 예약된 상황이 JSON파일로 필요하다면 아래 주석 풀어서 맞게 적용
					// const file = './uploads/LecList.json'
					// const list = result;
					// jsonfile.writeFile(file, {list}, function(err){
					// 	if(err) console.log(err);
					// });
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(result);
					if(err){
						console.log(err);
					} else {
          	res.end(JSON.stringify(result));
        	}
				}
        con.release();
			});
		}
	});
});

app.get('/lecture', function(req, res){
  res.sendFile(__dirname + '/public/lecture.html');
});

app.get("/lecutre/list", function(req, res){
  pool.getConnection(function(error, con){
    if(error){
      console.log(error);
    }else{
      var sql="select * from lecture2 order by number asc";//오름차순으로 보여줄거야

      con.query(sql, function(err, result){
        if(err){
          console.log(err);//심각한 에러, 해줄 수 있는 게 없다.
        }else{//오류가 안 난 경우...오류가 없다고 하여 수정이 완료되었다고 단정하면 안 된다.
					const file = './uploads/LecList.json'
					const list = result;

					jsonfile.writeFile(file, {list}, function(err){
						if(err) console.log(err);
					});
					if(err){
						console.log(err);
					} else {
          res.writeHead(200, {"Content-Type":"text/html"});
          res.end(JSON.stringify(result));
        	}
				}
        con.release();
			});
		}
	});
});

app.get('/food/admin', function(req, res){
	res.sendFile(path.join(__dirname + '/public/adminFood.html'));
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

// 교내전화번호
app.get('/phone/admin', function(req, res){
	res.sendFile(path.join(__dirname + '/public/adminPhone.html'));
});

//메뉴 추가 라우터
app.post("/phone/add", function(req, res){
	console.log('/phone/add 호출되었음.');

	var paramDepartment = req.body.department;
	var paramLocation = req.body.location;
	var paramPosition = req.body.position;
	var paramPhone = req.body.phone;

	addPhone(paramDepartment, paramLocation, paramPosition, paramPhone );
	console.log('Add Phone Success!');
});
////메뉴 추가 함수
function addPhone(paramDepartment, paramLocation, paramPosition, paramPhone){
		var phone;

		phone = new PhoneModel({
				department : paramDepartment,
				location : paramLocation,
				position : paramPosition,
				phone : paramPhone
		});

		phone.save(function(err) {
			if (err) {
				console.log(err);
			}
			console.log(paramDepartment+ ', '+paramLocation+ ', '+ paramPosition+ ',' + paramPhone + 'document 추가되었습니다.');
		});
}
////메뉴 읽기
app.get("/phone/list", function(req, res){
	console.log('/phone/list 호출되었음.');
	listPhone(req, res);
	console.log('List Phone Success');
});
//메뉴 읽기 함수
function listPhone(req, res) {
	PhoneModel.find({}, function(err, phones){
		console.log('phones.length: '+phones.length);

		const file = './uploads/PhoneList.json'
		const list = phones;

		jsonfile.writeFile(file, {list}, function(err){
			if(err) console.log(err);
		});
		if (err) {
			callback(err, null);
			return;
		} else {
			res.writeHead(200, {"Content-Type":"text/html"});
			res.end(JSON.stringify(phones));
		}
	});
}
////메뉴 삭제
app.post("/phone/del", function(req, res){
	var paramNum = req.body.number;

	PhoneModel.findOneAndDelete({
		'number': paramNum
		}, function(err, phones){
			if(err) {
				console.log(err);
			} else {
				console.log(paramNum+'번 document가 삭제되었습니다.');
			}
	});
});
//메뉴 전체 삭제
app.post("/phone/delAll", function(req, res){
	PhoneModel.deleteMany({}, function(err, phones){
			if(err) {
				console.err(err);
			} else {
				console.log('document가 전체 삭제되었습니다.');
			}
	});
});


// 몽구스 연결
function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/local';

  console.log('데이터베이스 연결을 시도합니다.');
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl,
    {
      useNewUrlParser: true,
      poolSize: 10
    }
  );
  database = mongoose.connection;
  autoIncrement.initialize(database);//add autoInc

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function () {
    console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

    createCafeteriaSchema(); //급식스키마생성
		createPhoneSchema(); //교내전화번호스키마생성
  });

  database.on('disconnected', function() {
    console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
    setInterval(connectDB, 5000);
  });
}

function createCafeteriaSchema() {

  var CafeteriaSchema = new Schema({
    number: {type: Number},
    date: {type: Number},
    part: {type: String, default: ''},
    menu: {type: String, default: ''}
  });
  console.log('CafeteriaSchema 정의되었음');

	CafeteriaSchema.plugin(autoIncrement.plugin, {model: 'Cafeteria', field: 'number'});//add autoInc
  CafeteriaModel = mongoose.model('Cafeteria', CafeteriaSchema);

  console.log('CafeteriaModel 정의되었음');
}

function createPhoneSchema(){
	var PhoneSchema = new Schema({
		number: {type: Number},
		department: {type:String},
		location: {type: String},
		position: {type: String, default: ''},
		phone: {type: String, default: ''}
	});
	console.log('PhoneSchema 정의되었음');

	PhoneSchema.plugin(autoIncrement.plugin, {model: 'Phone', field: 'number'});//add autoInc
	PhoneModel = mongoose.model('Phone', PhoneSchema);

	console.log('PhoneModel 정의되었음');
}

app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
	connectDB();
});
