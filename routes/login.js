/** login & logout **/
module.exports = function(conn, hasher, passport, LocalStrategy){
	var express = require('express');
	var router = express.Router();

	/** login **/
	router.get('/login', function(req, res){
	  var output = `
	  <h1>Login</h1>
	  <form action="/auth/login" method="post">
	    <p>
	      <input type="text" name="username" placeholder="username">
	    </p>
	    <p>
	      <input type="password" name="password" placeholder="password">
	    </p>
	    <p>
	      <input type="submit">
	    </p>
	  </form>
	  `;
	  res.send(output);
	});//줄바꿈 하기위해 p태그 사용
	router.post(
	  '/login', 
	  passport.authenticate(//passport.authenticate라는 미들웨어를 통해서 로그인
	    'local', //local strategy가 실행된다는 의미
	    { //위의 new LocalStrategy가 실행
	      successRedirect: '/welcome',
	      failureRedirect: '/login',//원래는 아래 who are you였음
	      failureFlash: false//로그인에 실패하면 딱 한 번만 보여주는 메시지(flash로 했을 때)
	    }
	  )
	);
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

	/** logout **/
	router.get('/logout', function(req, res){
	  req.logout();//세션에 있는 데이터를 패스포트가 제거해줌
	  req.session.save(function(){//작업이 끝난 후 조금 더 안전하게 웰컴페이지로 리다이렉션
	    res.redirect('/welcome');
	  });
	});

	return router;
}