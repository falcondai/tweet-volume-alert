var http = require('http'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(43988);
console.log('volume alert listening at : %s', 'http://localhost:43988/');

// utility functions
function getTweet(tid, callback) {
  http.get('http://api.twitter.com/1/statuses/oembed.json?omit_script=true&id=' + tid, function(res) {
    res.on('data', function(data) {
      callback(JSON.parse(data));
    });
  });
}

// http server
app.use(express.logger());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/stream/:symbol', function (req, res) {
  if (req.params.symbol != req.params.symbol.toUpperCase())
    res.redirect('/stream/' + req.params.symbol.toUpperCase());
  else
    res.sendfile(__dirname + '/stream.html');
});

app.get('/inject/message', function (req, res) {
  // GET /inject/message?t=<message>
  // broadcast to everyone
  if (!req.query.symbol)
    res.send(400);
  console.log('announcing: %s', req.query.t);
  res.send(200);
  io.of('/' + req.query.symbol).emit('new announcement', {text: req.query.t});
});

app.get('/inject/alert', function (req, res) {
  // GET /inject/alert?symbol=<company_symbol>&time=<timestamp_in_seconds>
  if (!req.query.symbol)
    res.send(400);
  req.query.symbol = req.query.symbol.toUpperCase();
  io.of('/alert').emit('new alert', {
    symbol: req.query.symbol,
    timestamp: +req.query.time * 1000
  });
  res.send(200);
});

app.get('/inject/per-minute-volume', function (req, res) {
  // GET /inject/per-minute-volume?symbol=<company_symbol>&volume=<count>&start_time=<timestamp_in_seconds>
  if (!req.query.symbol)
    res.send(400);
  req.query.symbol = req.query.symbol.toUpperCase();
  io.of('/' + req.query.symbol).emit('new volume', {
    volume: +req.query.volume,
    timestamp: +req.query.start_time * 1000
  });
  res.send(200);
});

app.get('/inject/tweet-id', function (req, res) {
  // GET /inject/tweet-id?symbol=<company_symbol>&tweet_id=<id>
  if (!req.query.symbol)
    res.send(400);
  req.query.symbol = req.query.symbol.toUpperCase();
  http.get({
    host: 'api.twitter.com',
    path: '/1/statuses/oembed.json?omit_script=true&id=' + req.query.tweet_id
  }, function(response) {
    var buf = '';
    response
      .on('data', function(chunk) {
        buf += chunk;
      })
      .on('end', function() {
        htmlText = JSON.parse(buf).html;
        if (htmlText)
          io.of('/' + req.query.symbol).emit('new tweet', {
            tid: +req.query.tweet_id,
            html: htmlText
          });
      })
      .on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  });
  res.send(200);
});

app.get('/tweet', function (req, res) {
  // return the json object
  
  http.get('http://api.twitter.com/1/statuses/oembed.json?omit_script=true&id=' + req.query.tid, function(r) {
    r.on('data', function(data) {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/ringtone', function (req, res) {
  res.sendfile(__dirname + '/ringtone');
});

app.get('/favicon.ico', function (req, res) {
  res.sendfile(__dirname + '/icon.png');
});

app.get('/icon.png', function (req, res) {
  res.sendfile(__dirname + '/icon.png');
});

// websocket server