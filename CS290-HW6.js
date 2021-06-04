var express = require('express');
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var consoleDebug = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4496);

function formatDate(inputDate){
  var hardDate = new Date(inputDate);
  var day = hardDate.getDate();
  var month = hardDate.getMonth() +1;
  var year = hardDate.getFullYear();
  
  var easyDate = month + "/" + day + "/" + year;
  return  easyDate;
}

app.get('/', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err,rows,fields){
    if(err){
        next(err);
        return;
    }
    var queryReturn = [];
    for(var n in rows){
      //Format bool weight unit to human readable
      if(rows[n].lbs){
        var unitString = "lbs";
      }else{
        var unitString = "kgs";
      }

      var easyDate = formatDate(rows[n].date);
      var addActivity = {'id':rows[n].id,'name':rows[n].name,'reps':rows[n].reps,'weight':rows[n].weight,'date':easyDate,'units':unitString};
      queryReturn.push(addActivity);
    }

    if(req.body["Add Activity"]){
      if(req.body.lbs){
        var unitString = "lbs";
      }else{
        var unitString = "kgs";
      }
      var addActivity = {'id':req.body.id,'name':req.body.name,'reps':req.body.reps,'weight':req.body.weight,'date':req.body.date,'units':unitString};
      queryReturn.push(addActivity);
    }

    if(consoleDebug){console.log("Call to / made")}
    context.results = queryReturn;
    res.render('home', context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      if(consoleDebug){console.log("Call to /reset-table made")}
      res.render('home');
    })
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", 
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], 
    function(err,result){
      if(err){
          next(err);
          return;
      }
      if(consoleDebug){console.log("Call to /insert made")}
      mysql.pool.query("SELECT * FROM workouts WHERE id = ?", [result.insertId], function(err,result){
        if(err){
          next(err);
          return  
        }
        res.send(JSON.stringify(result[0]));  //Pass string of input parameters containing new row ID
      });
    });
});

app.get('/delete', function(req, res, next) {
  var context = {};    
  mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id],
    function(err, result){
      if(err){
        next(err);
        return;
      }
      if(consoleDebug){console.log("Call to /delete made")}
      //context.results = result.deleteId;
      res.render('home');
    });
});

app.get('/edit', function(req, res, next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(consoleDebug){console.log("Call to /edit made")}
    alert("Wouldnt it be nice if you could actually change entry #" + [req.query.id] + "?");
  res.render('home');
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});