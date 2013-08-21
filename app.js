var http = require('http'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    config = require('./config'),
    tLastInject,
    feed = io.of('/feed'),
    email = require('./email'),
    time = require('time')(Date);

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
          callback(htmlText);
      })
      .on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  });
}

// middlewares
if ('production' == app.get('env'))
  app.use(express.logger());
else 
  app.use(express.logger('dev'));

app.use(require('stylus').middleware(__dirname + '/static'));
app.use(express.static(__dirname + '/static'))

app.use('/inject', function (req, res, next) {
  // check symbol query parameter
  if (req.query.symbol) {
    req.query.symbol = req.query.symbol.toUpperCase();
    next();
    // keep track of last successful injection
    tLastInject = Date.now();
  } else {
    res.send(400);
  }
});

// views
app.get('/', function (req, res) {
  res.render('index', {
    symbols: config.symbols,
    ga: config.googleAnalytics,
  });
});

app.get('/splash', function (req, res) {
  res.render('splash');
});

app.get('/stream/:symbol', function (req, res) {
  if (req.params.symbol != req.params.symbol.toUpperCase())
    // redirect user to the canonical URL
    res.redirect('/stream/' + req.params.symbol.toUpperCase());
  else
    res.render('stream', {
      symbol: req.params.symbol,
      company: config.symbols[req.params.symbol] || req.params.symbol,
      batchSize: config.ui.batchSize,
      queueDepth: config.ui.queueDepth,
      ga: config.googleAnalytics,
    });
});

// inject APIs
app.get('/inject/alert', function (req, res) {
  // GET /inject/alert?symbol=<company_symbol>&time=<timestamp_in_seconds>

  var issueTime = new Date();
  issueTime.setTimezone('America/New_York');

  feed.in(req.query.symbol).emit('new alert', {
    symbol: req.query.symbol,
    timestamp: +req.query.time * 1000,
  });
  email.sendAlert({
    symbol: req.query.symbol,
    company: config.symbols[req.query.symbol],
    issueTime: issueTime.toString(),
    url: ('production' == process.env.NODE_ENV ? 'http://stock.twithinks.com' : 'http://54.235.161.102:8000') + '/stream/' + req.query.symbol,
  }, function(err, res) {
    console.log('email status: ' + (err || res));
  });
  res.send(200);
});

app.get('/inject/per-minute-volume', function (req, res) {
  // GET /inject/per-minute-volume?symbol=<company_symbol>&volume=<count>&start_time=<timestamp_in_seconds>
  feed.in(req.query.symbol).emit('new volume', {
    volume: +req.query.volume,
    timestamp: +req.query.start_time * 1000,
  });
  res.send(200);
});

app.get('/inject/tweet-id', function (req, res) {
  // GET /inject/tweet-id?symbol=<company_symbol>&tweet_id=<id>
  getTweet(req.query.tweet_id, function (tweetHtml) {
    feed.in(req.query.symbol).emit('new tweet', {
      tid: req.query.tweet_id,
      html: tweetHtml,
    });
  });
  res.send(200);
});

// socket.io config
if ('production' == process.env.NODE_ENV) {
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

// use rooms to handle feed subscriptions
feed.on('connection', function (socket) {
  if (tLastInject) {
    socket.emit('last inject', {
      timestamp: tLastInject,
    });
  }
  socket.on('subscribe', function (data) {
    socket.join(data.symbol);
  })
  .on('unsubcribe', function (data) {
    socket.leave(data.symbol);
  });
});

// template config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// start
server.listen(config.server.port, 'production' == process.env.NODE_ENV ? 'localhost' : '0.0.0.0');
console.log('volume alert listening at port: %s', config.server.port);