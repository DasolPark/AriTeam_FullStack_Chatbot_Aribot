module.exports = function(){
	var mysql = require('mysql');
	var conn = mysql.createConnection({
		host	: '0.0.0.0',
		user 	: 'root',
		password: 'ari610',

		database: 'o2'
	});
	conn.connect();

	return conn;
}
