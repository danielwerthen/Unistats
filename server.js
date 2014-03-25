'use strict';
var nano = require('nano')('https://unieurocorn.cloudant.com/submissions'),
	_ = require('lodash'),
	cred = require('./config.json')
	;

nano.auth(cred.username, cred.password, function (err, body, headers) {
	if (err) {
		return console.writeline(err);
	}
	var db = require('nano')({
		url: 'https://unieurocorn.cloudant.com/submissions',
		cookie: headers['set-cookie']
	});
	db.view('submissions', 'voteByTrackId', function (err, docs) {
		console.log('Number of votes:');
		console.dir(docs.total_rows / 3);
		var points = _.reduce(docs.rows, function (result, num, key) {
			if (!result[num.key]) { 
				result[num.key] = 0;
			}
			result[num.key] += num.value.Points;
			return result;
		}, {});
		db.view('submissions', 'byTrackId', function (err, docs) {
			var res = _.reduce(docs.rows, function (result, num, key) {
				result[num.key] = { title: num.value.Username, points: points[num.key] || 0 };
				return result;
			}, {});
			console.log('Points per submission:');
			console.dir(res);
		});

	});
});


