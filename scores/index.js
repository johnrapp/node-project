var express = require('express'),
	Score = require('./score.js');

module.exports.api = function() {
	var router = express.Router();
	
	/*
	req.query:
		level
	*/
	router.get('/all', function(req, res, next) {
		Score.find({level: req.query.level}, function(err, scores) {
			if(err) next(err);

			res.json(scores);
		});
	});

	/*
	req.query:
		level
		from, length
		sort
	*/
	router.get('/interval', function(req, res, next) {
		Score.find({level: req.query.level})
			.sort(req.query.sort)
			.skip(req.query.from)
			.limit(req.query.length)
			.populate('owner')
			.exec(function(err, scores) {
				if(err) next(err);

				res.json(scores);
			});
	});

	/*
	LOGGED IN
	req.body:
		score
	*/
	router.post('/add', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next('No user in add score');

		Score.create({
			level: level._id,
			score: req.body.score,
			owner: user._id
		},
		function(err, score) {
			if(err) next(err);

			res.json(score);
		});
	});
	
	/*
	LOGGED IN
	req.body:
		id
	*/
	router.post('/remove', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next('No user in remove score');

		Score.findById(req.body.id)
			.where('owner', user._id)
			.remove(function(err, score) {
				if(err) next(err);

				res.json(score !== null);
			});
	});

	return router;
}
