module.exports = function(){
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  route.get('/add', function(req, res){//new에서 add로 변경
  	var sql = 'SELECT id, title FROM topic';
  	conn.query(sql, function(err, topics, fields){
  		if(err){
  			console.log(err);
  			res.status(500).send('Internal Server Error');
  		}
  		res.render('topic/add', {topics: topics, user: req.user});
  	});
  });
  route.post('/add', function(req, res){
  	var title = req.body.title;
  	var description = req.body.description;
  	var author = req.body.description;

  	var sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
  	conn.query(sql, [title, description, author], function(err, result, fields){
  		if(err){
  			res.status(500).send('Internal Server Error');
  			// res.sendStatus(500, 'Internal Server Error');//새로운 방식 테스트해보기
  			console.log(err);
  		} else {
  			res.redirect('/topic/'+result.insertId);
  		}
  	});
  });
  route.get(['/:id/edit'], function(req, res){
  	var sql = 'SELECT id, title FROM topic';
  	conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
  		// res.send(topics);//이렇게 쓰면 [object]가 3개 나옴
  		var id = req.params.id;
  		if(id){
  			var sql = 'SELECT * FROM topic WHERE id=?';
  			conn.query(sql, [id], function(err, topic, fields){
  				if(err){
  					console.log(err);
  					res.status(500).send('Internal Server Error');
  				} else {
  					res.render('topic/edit', {topics: topics, topic: topic[0], user: req.user})//topic[0]을 한 이유는 id=?에서 한 가지 값에 매치된 것을 가져올 것이니까
  				}
  			});
  		} else {
  			console.log(err);
  			res.status(500).send('Internal Server Error');
  		}
  	});
  });
  route.post(['/:id/edit'], function(req, res){
  	var title = req.body.title;
  	var description = req.body.description;
  	var author = req.body.author;
  	var id = req.params.id;//
  	var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  	conn.query(sql, [title, description, author, id], function(err, result, fields){
  		if(err){
  			console.log(err);
  			res.status(500).send('Internal Server Error');
  		} else {
  			// res.send(result);
  			res.redirect('/topic/'+id);
  		}
  	});
  });
  route.get(['/:id/delete'], function(req, res){
  	var sql = 'SELECT id, title FROM topic';
  	var id = req.params.id;
  	conn.query(sql, function(err, topics, fields){
  		var sql = 'SELECT * FROM topic WHERE id=?';
  		conn.query(sql, [id], function(err, topic){
  			if(err){
  				console.log(err);
  				res.status(500).send('Internal Server Error');
  			} else {
  				if(topic.length === 0){//존재하지 않는 데이터를 삭제하지 않도록
  					console.log('There is no id.');
  					res.status(500).send('Internal Server Error');
  				}
  				// res.send(topic);
  				res.render('topic/delete', {topics: topics, topic: topic[0], user: req.user});
  			}
  		});
  	});
  });
  route.post(['/:id/delete'], function(req, res){
  	var id = req.params.id;
  	var sql = 'DELETE FROM topic WHERE id=?';
  	conn.query(sql, [id], function(err, result){
  		// res.send(result);
  		res.redirect('/topic/');
  	});
  });
  route.get(['/', '/:id'], function(req, res){
  	var sql = 'SELECT id, title FROM topic';
  	conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
  		// res.send(topics);//이렇게 쓰면 [object]가 3개 나옴
  		var id = req.params.id;
  		if(id){
  			var sql = 'SELECT * FROM topic WHERE id=?';
  			conn.query(sql, [id], function(err, topic, fields){
  				if(err){
  					console.log(err);
  					res.status(500).send('Internal Server Error');
  				} else {
  					res.render('topic/view', {topics: topics, topic: topic[0], user: req.user})//topic[0]을 한 이유는 id=?에서 한 가지 값에 매치된 것을 가져올 것이니까
  				}
  			});
  		} else {
  			res.render('topic/view', {topics: topics, user: req.user});//topics는 원래 files였음(원래는 파일을 읽어왔으니까)
  		}
  	});
  });

  return route;
}
