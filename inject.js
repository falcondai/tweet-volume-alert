var _host = '54.235.161.102';
var _host = 'localhost';
var _port = 43988,
		http = require('http'),
		fs = require('fs');

function injectTweet(symbol, tid) {
	http.get({
		hostname: _host,
		port: _port,
		path: '/inject/tweet-id?symbol=' + symbol + '&tweet_id=' + tid
	}, function (res) {
		res.setEncoding('utf8');
		res.on('readable', function() { console.log(res.read()); });
		console.log('injected tweet %d into %s stream', tid, symbol);
	});
}

function injectVolume(symbol, volume, start_time) {
	http.get({
		host: _host, 
		port: _port,
		path: '/inject/per-minute-volume?symbol=' + symbol + '&volume=' + volume + '&start_time=' + Math.ceil(start_time/1000)
	}, function (res) {
		res.setEncoding('utf8');
		res.on('readable', function() { console.log(res.read()); });
		console.log('injected volume %d at %s into %s stream', volume, new Date(start_time), symbol);
	});
}

function injectAlert(symbol, time) {
	http.get({
		host: _host,
		port: _port,
		path: '/inject/alert?symbol=' + symbol + '&time=' + Math.ceil(time/1000)
	}, function (res) {
		res.setEncoding('utf8');
		res.on('readable', function() { console.log(res.read()); });
		console.log('injected alert at %s into %s stream', new Date(time), symbol);
	});
}

var data = fs.readFile('aapl.tids', {encoding: 'ascii'}, function(err, data) {
	var tids = data.split('\n'),
			n = tids.length - 1,
			idx = 0;
	console.log('loaded %d tweet ids', n);
	
	setInterval(function() { 
		injectTweet('aapl', tids[idx]); 
		idx = (idx + 1) % n;
		}, 1000);
		
	setInterval(function() { 
		injectAlert('aapl', Date.now()); 
		}, 30000);
		
	setInterval(function() { 
		injectVolume('aapl', Math.ceil(Math.random()*100), Date.now()); 
		}, 5000);
});

