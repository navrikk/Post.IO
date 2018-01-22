var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Post', postSchema);