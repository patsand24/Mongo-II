/* eslint-disable */

const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
	const { soID } = req.params;
	
	Post.findOne({ soID }, (error, question) => {
		if (error || !question) {
			return res.status(STATUS_USER_ERROR).json(error);
		} 
		Post.findOne({ soID: question.acceptedAnswerID }, (error2, answer) => {
			if (error2 || !answer) {
				return res.status(STATUS_USER_ERROR).json(error);
			} else {
				res.status(200).json(answer);
			}
		}
		)
	});
});

server.get('/top-answer/:soID', function(req, res) {
	const { soID } = req.params;
	Post.findOne({ soID }, (error, question) => {
		if (error || !question) {
			return res.status(STATUS_USER_ERROR).json(error);
		} 
		const topPost = Post.findOne({ soID: { $ne: question.acceptedAnswerID},
		parentID: question.soID 
		});
		topPost.sort({ score: -1 }).exec((error, answer) => {
			if (error || !answer) {
				return res.status(STATUS_USER_ERROR).json(error);
			} else {
				res.status(200).json(answer)
			}
		});
	});
});

server.get('/popular-jquery-questions', function(req, res) {
	Post.find({
		tags: { $in: ['jquery'] }, 
		$or: [
			{ score: { $gte: 5000 }},
			{ 'user.reputation': { $gte: 200000 }}
		]
	}, 
	(error, result) => {
		if (error) {
			return res.status(STATUS_USER_ERROR).json(error);
		}
		res.json(result);
		});
	});

server.get('/npm-answers', function(req, res) {
	Post.find({
		tags: { $in: ['npm'] }
	},
	function(error, result) {
		if (error || !result) {
			return res.status(STATUS_USER_ERROR).json(error);
		}
		const questionID = result.map(element => element.soID);
		Post.find({ parentID: { $in: questionID }},
			function(error, answer) {
				if (error) {
					return res.status(STATUS_USER_ERROR).json(error);
				}
				res.status(200).json(answer);
			}
		)
	})
})


module.exports = { server };
