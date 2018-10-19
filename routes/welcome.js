/** welcome **/
var express = require('express');
var router = express.Router();

router.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){//로그인에 성공 했다면, 해당 사용자의 개인화된 화면을 보여줄 수 있다
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>welcome</h1>
      <ul>
        <li><a href="/auth/login">login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

module.exports = router;