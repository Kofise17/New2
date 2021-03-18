var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/home/');
});

/* SHOW LOGIN PAGE*/
router.get('/login', (req, res) => {
    res.render('login.ejs', {})
})

/* SHOW WELCOME PAGE */
router.get('/welcome', (req, res) => {
    res.render('welcome.ejs', {})
})

module.exports = router;