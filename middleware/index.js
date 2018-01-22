var Post 	= require('../models/post'),
	Comment 	= require('../models/comment');


//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
	//is user logged in
	if(req.isAuthenticated()) {
		Post.findById(req.params.id, function(err, foundPost) {
			if(err) {
				req.flash('error', 'Something went wrong. Please try again.');
				res.redirect('back');
			} else {
				//does the user own the post
				if(foundPost.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that.');
		res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	//is user logged in
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				req.flash('error', 'Something went wrong. Please try again.');
				res.redirect('back');
			} else {
				//does the user own the post
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that.');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that.');
		res.redirect('back');
	}
}


middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that');
	res.redirect('/login');
}

module.exports = middlewareObj;