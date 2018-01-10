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
	
	Post.findOne({ soID }, (question, error) => {
		if (error) {
			return res.status(STATUS_USER_ERROR).json(error);
		} 
		Post.findOne({ soID: question.acceptedAnswerID }, (error2, answer) => {
			if (error2) {
				return res.status(STATUS_USER_ERROR).json(error);
			} else {
				res.json(answer);
			}
		}
		)
	});
});

module.exports = { server };
