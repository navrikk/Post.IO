var express 	= require('express');
var router 		= express.Router({mergeParams: true});
var Post 	= require('../models/post');
var Comment 	= require('../models/comment');
var middleware  = require('../middleware');


//show form to add a new comment
router.get('/new', middleware.isLoggedIn, function(req, res) {
	//find the associated post
	Post.findById(req.params.id, function(err, foundPost) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			res.render('comments/new', {post: foundPost});
		}
	});
});

//handle the logic for adding the new comment
router.post('/', middleware.isLoggedIn, function(req, res) {
	//look up post using id
	Post.findById(req.params.id, function(err, foundPost) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/posts');
		} else {
			//create a new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					req.flash('error', 'Something went wrong. Please try again.');
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect a new comment to post
					foundPost.comments.push(comment);
					foundPost.save();
					req.flash('success', 'Comment added.');
					//redirect to post show page
					res.redirect('/posts/' + foundPost._id);
				}
			});	
		}
	});
});


// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('back');
		} else {
			res.render('comments/edit', {
				post_id: req.params.id,
				comment: foundComment,
			});
		}
	});	
});

// UPDATE COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment updated.');
			res.redirect('/posts/' + req.params.id);
		}
	});
});


// DELETE COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted.');
			res.redirect('/posts/' + req.params.id);
		}
	});
});


module.exports = router;