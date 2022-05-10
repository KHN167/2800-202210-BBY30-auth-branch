"use strict";
// create an express app
const express = require("express")
const session = require('express-session')
const app = express()
var path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const methodOverride = require('method-override');
const res = require("express/lib/response");
const req = require("express/lib/request");
const passport = require('passport');

const users = []
const initializePassport = require('./passport-setup')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)


mongoose.connect('mongodb+srv://Khn167:mlhch6IIJRXmUzU4@cluster0.2afy9.mongodb.net/test',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(require("express-session")({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
}))


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))


mongoose.connect('mongodb+srv://Khn167:mlhch6IIJRXmUzU4@cluster0.2afy9.mongodb.net/test',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


// use the express-static middleware
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', checkAuthenticated,  (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/dashboard.html'))
})

app.get('/login', checkLoggedIn,  (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/loginpage.html'))
})

app.get('/admin', checkAuthenticated,  (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/admin.html'))
})

app.post('/login', checkLoggedIn, passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
  }))

app.get('/register' , checkLoggedIn,  (req, res) => {
	res.sendFile(path.join(__dirname, '/public/signup.html'))

})

app.post('/register', checkLoggedIn, (req, res) => {
	Users = new User({
		username: req.body.username
	});

	User.register(Users, req.body.password, function(err, user){
		if(err) {
			res.json({
				success: false,
				message: 'Your account could not be saved',
				err
			})

		} else {
			res.json({
				success: true,
				message: 'Your account was saved',
			})
		}
	});

	

  })




app.delete('/logout', (req, res) =>{
	req.logOut()
	res.redirect('/login')
})


// define the first route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
  res.render({name: req.user.name})
});


function checkAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}

	res.redirect('/login')
}

function checkLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return res.redirect('/dashboard')
	}
	next()
}





// start the server listening for requests
app.listen(process.env.PORT || 7000, 
	() => console.log("Server is running..."));