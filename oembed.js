var http = require('http'),
		fs = require('fs');

function check(jsons, tid) {
	var t0 = Date.now();
	http.get({
		  hostname: 'api.twitter.com',
		  path: '/1/statuses/oembed.json?omit_script=true&id=' + tid
		}, function(res) {
		  var buf = '';
		  res
		    .on('data', function(chunk) {
		      buf += chunk;
		    })
		    .on('end', function() {
		    	//console.log(Date.now() - t0);	
					jsons[tid] = buf;
					console.log(buf);
		    })
		    .on('error', function(e) {
		      console.log("Got error: " + e.message);
		    });
		});
}

fs.readFile('aapl.tids', {encoding: 'ascii'}, function(err, data) {
	var tids = data.split('\n'),
			n = tids.length,
			jsons = {};
			
	while (--n >= 0) {
		check(jsons, tids[n]);
	}
});
