//requiring packages
var express 			= require('express'),
	app 				= express(),
	bodyPraser 			= require('body-parser'),
	mongoose 			= require('mongoose'),
	passport			= require('passport'),
	LocalStrategy 		= require('passport-local'),
	methodOverride		= require('method-override'),
	flash 				= require('connect-flash'),
	expressSanitizer 	= require('express-sanitizer');

//requiring models
var User 		= require('./models/user'),
	Post 	= require('./models/post'),
	Comment 	= require('./models/comment');


//requiring routes	
var	indexRoutes			= require('./routes/index'),
	postRoutes 	= require('./routes/posts'),
	commentRoutes		= require('./routes/comments');

//LOCAL MONGODB
// mongoose.connect('mongodb://localhost/post_io', {useMongoClient: true});

//REMOTE MONGODB
mongoose.connect('mongodb://nikshepav:<insert_password_here>@ds111078.mlab.com:11078/post-io', {useMongoClient:true});

app.use(bodyPraser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(expressSanitizer());


// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'This is a secret message',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);


//LOCAL DEPLOYMENT
// app.listen(portNum = 3001, function(req, res) {
// 	console.log('Post.IO server (' + portNum + ') is online.....');
// });

//REMOTE DEPLOYMENT
app.listen(process.env.PORT, process.env.IP);