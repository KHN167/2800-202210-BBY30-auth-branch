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





mongoose.connect('mongodb+srv://Khn167:mlhch6IIJRXmUzU4@cluster0.2afy9.mongodb.net/test',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.urlencoded({extended: false}));

app.use(require("express-session")({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }))

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



app.get('/userProfile', checkAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/public/userProfile.html'))
})

app.post('/userProfile', async (req, res) => {
	const { password } = req.body;

	let restP = new User();

    try {
      const newP = await restP.generateHash(password.password);

      const resetP = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { passwordHash: newP } },
        {
          fields: { passwordHash: 0 },
          new: true
        }
      )

      res.send(resetP);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
})

app.post('/login', checkLoggedIn, passport.authenticate("local", {
	successRedirect: '/dashboard',
	failureRedirect: '/login'
  }), function(req, res){

  });

app.get('/register' , checkLoggedIn,  (req, res) => {
	res.sendFile(path.join(__dirname, '/public/signup.html'))

})

app.post('/register', checkLoggedIn, (req, res) => {

	User.register(new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname}), req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.redirect('/register')
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/login");
		});
	});
  });




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