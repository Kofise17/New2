var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
var db;

MongoClient.connect(connstring, {useUnifiedTopology: true}, (err, database) => {
  db = database.db('SWS_DB')
  if (err) return console.log(err)

  /* GET LOGINPAGE */
  router.get('/', (req, res) => {
    res.render('login.ejs')
  })

  /* SHOW SIGNUP PAGE */
  router.get('/signup', (req, res) =>{
    res.render('signup.ejs', {})
  })

  /* ADD USER TO DB*/
  router.post('/add', (req, res) => {
    db.collection('Users').insertOne(req.body, (err, result) => {
      if (err) return
      res.redirect('/home/welcome')
    })
  })

  /* SHOW WELCOME PAGE */
  router.get('/welcome', (req, res) => {
    res.render('welcome.ejs', {})
  })

  /* SHOW ADD PRODUCT FORM */
  router.get('/add', (req, res) => {
    res.render('signup.ejs', {})
  })
})

module.exports = router;