const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    isLoggedIn = false;
    if(req.isAuthenticated()) {
        isLoggedIn = true;
    }
    res.render('about/index', {isLoggedIn : isLoggedIn}); 
});

module.exports = router;