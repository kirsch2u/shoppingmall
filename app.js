var express = require('express'); //경량 http 프레임워크
var path = require('path');
var favicon = require('serve-favicon'); //파비콘
var logger = require('morgan'); //로깅 모듈
var cookieParser = require('cookie-parser'); //쿠키
var bodyParser = require('body-parser'); //쿼리
var session = require('express-session'); //세션
var passport = require('passport');

global.pool = require('./config/dbpool');

var app = express();

var main = require('./routes/index');
var products = require('./routes/products');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//쿠키파서 -> 익스프레스 세션 -> passport.initilize() -> passport.session() 순서 중요. 반드시 이 순서로...
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  "secret" : "8915ee97525623f9a4bba5090bd39586202c1ed651f29071a1f00126b149c054", //openSSL설치 후 cmd 관리자모드에서 openssl rand -base64 32 명령 실행. path설정 필요
  "cookie" : { "maxAge" : 86400000 }, //하루동안 유지. 3600초 * 1000밀리세컨드 * 24시간
  "resave" : true,
  "saveUninitialized" : true
}));
app.use(passport.initialize()); //반드시 express.session다음에 위치해야 한다.
app.use(passport.session()); //반드시 express.session다음에 위치해야 한다.

app.use('/', main);
app.use('/products', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
