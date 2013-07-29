var _host = 'localhost',
		_port = 43988,
		http = require('http'),
		fs = require('fs'),
		tids = [],
		idx = 0;

var data = fs.readFileSync('aapl.tids', {encoding: 'ascii'});
tids = data.split('\n');
console.log('loaded %d tweet ids', tids.length);

function injectTweet(tid) {
	http.get({
		host: _host,
		port: _port,
		path: '/inject/tweet-id?tweet_id=' + tid
	}, function (res) {
		console.log(res.statusCode);
		if (res.statusCode == 200)
			console.log('injected tweet %d', tid);
	})
	.on('error', function() {
		console.error(req);
	});
}

function injectVolume(volume, start_time) {
	http.get({
		host: _host, 
		port: _port,
		path: '/inject/per-minute-volume?volume='+volume+'&start_time='+Math.ceil(start_time/1000)
	}, function (res) {
		console.log(res.statusCode);
		if (res.statusCode == 200)
			console.log('injected volume %d at %s', volume, new Date(start_time));
	});
}

function injectAlert(time) {
	http.get({
		host: _host,
		port: _port,
		path: '/inject/alert?time='+Math.ceil(time/1000)
	}, function (res) {
		if (res.statusCode == 200)
			console.log('injected alert at %s', new Date(time));
	});
}

function tweetLoop() {
	injectTweet(tids[idx]);
	idx = (idx + 1) % (tids.length - 1);
	setTimeout(function(){
		tweetLoop();
	}, Math.random()*5000+1000);
}

function alertLoop() {
	injectAlert(Date.now());
	setTimeout(function(){
		alertLoop();
	}, 1000);
}

alertLoop();
// tweetLoop();
// injectAlert(Date.now());
// setInterval(function(){
// 	injectAlert(Date.now());
// }, 1000);

// injectVolume(Math.ceil(Math.random()*10000), Date.now());
// setInterval(function(){
// 	injectVolume(Math.ceil(Math.random()*10000), Date.now());
// }, 1000);

// injectTweet(tids[0]);
// setInterval(function(){
// 		injectTweet(tids[idx]);
// 		idx = (idx + 1) % (tids.length - 1);
// 		console.log(idx);
// 	}, 1000);