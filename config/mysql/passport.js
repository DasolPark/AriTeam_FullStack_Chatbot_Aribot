module.exports = function(app){
	var conn = require('./db')();
	var bkfd2Password = require("pbkdf2-password");
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var hasher = bkfd2Password();

	app.use(passport.initialize());
	app.use(passport.session());//인증할 때 세션을 사용하겠다(반드시 app.use(session({})))뒤에 나와야한다

	passport.serializeUser(function(user, done) {//딱 한 번 실행됨
		console.log('serializeUser', user);
	  done(null, user.authId);//해당 사용자를 구별할 수 있는 식별자를 두 번째 인자로 보냄
	});//세션에 등록되고, 따라서 다음에 방문할 때도 이름을 기억함

	passport.deserializeUser(function(id, done) {//이미 등록되어있으면 이 func이 실행됨
		console.log('deserializeUser', id);
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, [id], function(err, results){//[id]에는 authId가 들어와서 local:을 써줄 필요 없음
			if(err){
				console.log(err);
				done('There is no user.');
			} else {
				done(null, results[0]);
			}
		});
	});
	passport.use(new LocalStrategy(
		function(username, password, done){//done은 함수를 담아주기로 약속되어 있음
			var uname = username;
			var pwd = password;
			var sql = 'SELECT * FROM users WHERE authId=?';
			conn.query(sql, ['local:'+uname], function(err, results){
				console.log(results);
				if(err){
					return done('There is no user.');
				}
				var user = results[0];
				return hasher({password:pwd, salt: user.salt}, function(err, pass, salt, hash){
					if(hash === user.password){
						console.log('LocalStrategy', user);
						done(null, user);//serializeUser가 실행됨
					} else {
						done(null, false);//pwd가 틀렸음(그럼 그냥 메시지 없이 끝임 false라서)
					}
				});
			});
		}
	));

	return passport;
}
