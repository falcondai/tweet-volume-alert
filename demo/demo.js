var host = 'localhost',
    port = require('../config').server.port, 
    http = require('http'),
    fs = require('fs');

function injectTweet(symbol, tid) {
  http.get({
    hostname: host,
    port: port,
    path: '/inject/tweet-id?symbol=' + symbol + '&tweet_id=' + tid
  }, function (res) {
    res.setEncoding('utf8');
    res.on('readable', function() { console.log(res.read()); });
    console.log('injected tweet %d into %s stream', tid, symbol);
  });
}

function injectVolume(symbol, volume, start_time) {
  http.get({
    host: host, 
    port: port,
    path: '/inject/per-minute-volume?symbol=' + symbol + '&volume=' + volume + '&start_time=' + Math.ceil(start_time/1000)
  }, function (res) {
    res.setEncoding('utf8');
    res.on('readable', function() { console.log(res.read()); });
    console.log('injected volume %d at %s into %s stream', volume, new Date(start_time), symbol);
  });
}

function injectAlert(symbol, time, tid) {
  http.get({
    host: host,
    port: port,
    path: '/inject/alert?symbol=' + symbol + '&time=' + Math.ceil(time/1000) + '&tweet_id=' + tid
  }, function (res) {
    res.setEncoding('utf8');
    res.on('readable', function() { console.log(res.read()); });
    console.log('injected alert at %s into %s stream', new Date(time), symbol);
  });
}

fs.readFile('msft.good.csv', {encoding: 'ascii'}, function(err, data) {
  var tids = data.split('\n'),
      n = tids.length - 1,
      idx = 0;
  console.log('loaded %d tweet ids', n);
  console.log('start injecting to http://%s:%s', host, port);
  
  var next = setInterval(function() { 
    injectTweet('msft', tids[idx].split(',')[0]); 
    if (++idx > n) {
      clearInterval(next);
    }
  }, 2 * 1000);
    
  setTimeout(function() { 
    // timestamp in ms 1377262899697 Aug.23rd
    injectAlert('msft', 1377262899697, '370893599707123712'); 
    }, 10 * 1000);
    
  // setTimeout(function() { 
  //   injectVolume('msft', Math.ceil(Math.random()*100), Date.now()); 
  //   }, 8000);
});

