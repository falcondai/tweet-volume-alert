var http = require('http'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    config = require('./config');

// utility functions
function getTweet(tid, callback) {
  http.get({
    hostname: 'api.twitter.com',
    path: '/1/statuses/oembed.json?omit_script=true&id=' + tid
  }, function(response) {
    var buf = '';
    response
      .on('data', function(chunk) {
        buf += chunk;
      })
      .on('end', function() {
        htmlText = JSON.parse(buf).html;
        if (htmlText)
          console.log(htmlText);
          callback(htmlText);
      })
      .on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  });
}

// middlewares
if ('development' == app.get('env'))
  app.use(express.logger('dev'));
else 
  app.use(express.logger());

app.use(require('stylus').middleware(__dirname + '/static'));
app.use(express.static(__dirname + '/static'))

app.use('/inject', function (req, res, next) {
  // check symbol query parameter
  if (req.query.symbol)
    next();
  res.send(400);
});

// views
app.get('/', function (req, res) {
  res.render('index.jade', {
    symbols: config.symbols
  });
});

app.get('/stream/:symbol', function (req, res) {
  if (req.params.symbol != req.params.symbol.toUpperCase())
    // redirect user to the canonical URL
    res.redirect('/stream/' + req.params.symbol.toUpperCase());
  else
    res.render('stream.jade', {
      symbol: req.params.symbol
    });
});

// inject APIs
app.get('/inject/alert', function (req, res) {
  // GET /inject/alert?symbol=<company_symbol>&time=<timestamp_in_seconds>
  if (!req.query.symbol) {
    res.send(400);
    return ;
  }
  req.query.symbol = req.query.symbol.toUpperCase();
  io.of('/' + req.query.symbol).emit('new alert', {
    symbol: req.query.symbol,
    timestamp: +req.query.time * 1000
  });
  res.send(200);
});

app.get('/inject/per-minute-volume', function (req, res) {
  // GET /inject/per-minute-volume?symbol=<company_symbol>&volume=<count>&start_time=<timestamp_in_seconds>
  if (!req.query.symbol) {
    res.send(400);
    return ;
  }
  req.query.symbol = req.query.symbol.toUpperCase();
  io.of('/' + req.query.symbol).emit('new volume', {
    volume: +req.query.volume,
    timestamp: +req.query.start_time * 1000
  });
  res.send(200);
});

app.get('/inject/tweet-id', function (req, res) {
  // GET /inject/tweet-id?symbol=<company_symbol>&tweet_id=<id>
  if (!req.query.symbol) {
    res.send(400);
    return ;
  }
  req.query.symbol = req.query.symbol.toUpperCase();
  getTweet(req.query.tweet_id, function (tweetHtml) {
    io.of('/' + req.query.symbol).emit('new tweet', {
      tid: req.query.tweet_id,
      html: tweetHtml
    });
  });
  res.send(200);
});

// socket.io config
if ('development' != process.env.NODE_ENV) {
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging

  // enable all transports (optional if you want flashsocket support, please note that some hosting
  // providers do not allow you to create servers that listen on a port different than 80 or their
  // default port)
  io.set('transports', [
      'websocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
}

// template config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// start
var port = ('development' == process.env.NODE_ENV)? process.env.DEVELOPMENT_PORT: process.env.PRODUCTION_PORT;
server.listen(port);
console.log('volume alert listening at port: %s', port);