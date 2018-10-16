/*Mongoose를 이용해 Data넣기 예제*/
//이제 사용자가 브라우저에서 메뉴CRUD 되도록 만들기
var mongoose = require('mongoose') //mongoose module 불러오기
var Schema = mongoose.Schema; //Schema를 제작할 수 있는 Schema 객체 변수 만들기

mongoose.connect('mongodb://localhost:27017/mongotest');//호스트, 포트, db이름
mongoose.connection.on('open', function(){
  console.log('Mongoose connected');
});

var CafeteriaSchema = new Schema({//스키마 정의
  date: {type: Number},
  part: {type: String, default: 0},
  menu: {type: String, default: 0},
});

var CafeteriaModel = mongoose.model('Cafeteria', CafeteriaSchema);//모델 객체 생성 및 컬렉션 생성

var menuArray = [//메뉴 배열
  {date: '1015', part: '한식(백반)', menu:'백미밥, 돼지고기 김치찌개, 미트볼 떡조림, 오이무침, 깍두기'},
  {date: '1015', part: '양식', menu:'백미밥, 순살등심돈까스&데미소스, 크림스프, 알새우칩&케찹, 단무지'},
  {date: '1015', part: '일품', menu:'제육덮밥&후라이, 우동장국, 콩나물무침, 배추김치, 요구르트'},
  {date: '1015', part: '석식', menu:'백미밥, 샤브샤브국, 옛날소시지전&케찹, 감자버터구이, 오이지무침, 깍두기'}
];
CafeteriaModel.create(menuArray, function(err, docs){//배열로 정보 넣기
    if(err)
        console.err(err);
    else{
        for(var i=0; i<docs.length; i++)
            console.log(docs[i]);
    }
});
/* 첫 번째 예제
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/mongotest');
mongoose.connection.on('open', function(){
	console.log('Mongoose connected');
});

var Cafeteria = new Schema({
	date: {type: Number},
	part: {type: String, default: 0},
	menu: {type: String, default: 0},
});

var CafeteriaModel = mongoose.model('Cafeteria', Cafeteria);
var menu1 = {
    "menu_1":{date: '1015', part: '한식(백반)', menu:'백미밥, 돼지고기 김치찌개, 미트볼 떡조림, 오이무침, 깍두기'},
    "menu_2":{date: '1015', part: '양식', menu:'백미밥, 순살등심돈까스&데미소스, 크림스프, 알새우칩&케찹, 단무지'},
    "menu_3":{date: '1015', part: '일품', menu:'제육덮밥&후라이, 우동장국, 콩나물무침, 배추김치, 요구르트'},
    "menu_4":{date: '1015', part: '석식', menu:'백미밥, 샤브샤브국, 옛날소시지전&케찹, 감자버터구이, 오이지무침, 깍두기'}
    };
var newMenu = new CafeteriaModel(
    menu1.menu_1, menu1.menu_2, menu1.menu_3, menu1.menu_4
);
newMenu.save();
 */