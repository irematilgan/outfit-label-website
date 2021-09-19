const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return true;
    return false;
}

router.get('/', (req, res) => {
    res.render('about/index', {isLoggedIn : isLoggedIn}); 
});

module.exports = router;