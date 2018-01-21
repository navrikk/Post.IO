var express 	= require('express');
var router 		= express.Router();
var Post 	= require('../models/post');
var middleware  = require('../middleware');


//INDEX - show all posts
router.get('/', function(req, res) {
	//Get all posts from db
	Post.find({}, function(err, allPosts) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			res.render('posts/index', {posts: allPosts});
		}
	})
});


//CREATE - add new post to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newPost = {name: name, image: image, description: desc, author: author};
	
	//create a new post and save to the db
	Post.create(newPost, function(err, newlyCreated) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			req.flash('success', 'Successfully created.');
			//redirect back to posts
			res.redirect('/posts');
		}
	});
});


//NEW - show form to create new post
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('posts/new');
});



//SHOW - shows more info about one post
router.get('/:id', function(req, res) {
	//find the post with the provided ID
	Post.findById(req.params.id).populate('comments').exec(function(err, foundPost) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
		} else {
			//render show template with associated compound
			Post.find({}, function(err, allPosts) {
				if(err) {
					req.flash('error', 'Something went wrong. Please try again.');
				} else {
					res.render('posts/show', {
						post: foundPost,
						allPosts: allPosts
					});
				}
			});
		}
	});
});


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkPostOwnership, function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
		res.render('posts/edit', {post: foundPost});	
	});
});


// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkPostOwnership, function(req, res) {
	//find and update the correct post
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/posts');
		} else {
			req.flash('success', 'Successfully updated.');
			//redirect show page
			res.redirect('/posts/' + updatedPost._id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkPostOwnership, function(req, res) {
	Post.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			req.flash('error', 'Something went wrong. Please try again.');
			res.redirect('/posts');
		} else {
			req.flash('success', 'Successfully deleted.');
			res.redirect('/posts');
		}
	});
});


module.exports = router;