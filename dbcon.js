var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_bonneri',
  password        : '7171',
  database        : 'cs290_bonneri'
});

module.exports.pool = pool;
