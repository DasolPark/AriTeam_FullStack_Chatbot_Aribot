module.exports = function(){
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var autoIncrement = require('mongoose-auto-increment');
  var mongoUrl = 'mongodb://localhost:27017/local';

  console.log('데이터베이스 연결을 시도합니다.');
  mongoose.Promise = global.Promise;
  mongoose.connect(mongoUrl,
    {
      useNewUrlParser: true,
      poolSize: 10
    }
  );
  mongoConn = mongoose.connection;
  autoIncrement.initialize(mongoConn);//add autoInc

  mongoConn.on('error', console.error.bind(console, 'mongoose connection error.'));
  mongoConn.on('open', function () {
    console.log('데이터베이스에 연결되었습니다. : ' + mongoUrl);
  });

  mongoConn.on('disconnected', function() {
    console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
    setInterval(connectDB, 5000);
  });
  return Schema;
}
