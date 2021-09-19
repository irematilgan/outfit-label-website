const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const bcrypt = require('bcrypt');
const { response } = require('express');

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.member && req.cookies.user_sid) {
      res.redirect("/");
    } else {
      next();
    }
};

router.get('/', sessionChecker, async(req,res) => {
    res.render('./register', {isLoggedIn : false});
});

router.post('/', async(req,res) => {

    try{
        const email = req.body.email;
        const currentMember = await Member.findOne({email : email});
        console.log(currentMember);
        if(currentMember) {
            console.log('Kullanici mail adresi mevcut');
            res.redirect('./register');
        } else {
            //const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const member = new Member({
                'email' : email,
                'password' : req.body.password
            });
    
            const newMember = await member.save();
            console.log(newMember);
            res.redirect('./login');
        }


    } catch (err){
        console.log(err);
        res.send(err);
    }
});

module.exports = router