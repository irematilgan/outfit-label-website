const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user,done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, user) {
        done(err,user);
    });
});

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
},function(email, password, done) {
    Member.findOne({email : email}, function(err, user) {
        if(err) {return done(err);}
        if(!user) {
            return done(null, false, {message : 'Incorrect Email'});
        }
        bcrypt.compare(password, user.password, function(err,res) {
            if(err) {return done(err);}
            if(res == false) {
                return done(null, false, {message : 'Incorrect Password'});
            }
            return done(null, user);
        });
    });
}));

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()) return next();
    res.redirect('/');
}

router.get('/', isLoggedOut, function(req,res){
    res.render('./login', {errorMessage : null});
});

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.context = user.id;
            return res.redirect('../');
        });
    })(req, res, next);
});

module.exports = router