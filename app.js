var express = require('express');
var http = require('http');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = io.listen(server);
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var core = require('./core.js');

io.set('log level', 1);
app.engine('dust', cons.dust);
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('template_engine', 'dust');
  app.set('view engine', 'dust');
  app.set('port', 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res){
  res.render('index', { title: 'Tic-Tac-Toe' });
});

server.listen(app.get('port'));
console.log("Tic-Tac-Toe server started on port %d in %s mode", app.get('port'), app.settings.env);

core(io);