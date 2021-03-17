var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
var db;
const functions = require("../public/js/functional1");
const signups = require("../public/js/signup");

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
  router.post('/signup', (req, res) => {
    if(signups.signup()){
      createUser();
      res.redirect('/home/welcome')
    }
    /* db.collection('Users').insertOne(req.body, (err, result) => {
      if (err) return
      res.redirect('/home/welcome')
    }) */
  })

  /* SHOW WELCOME PAGE */
  router.get('/welcome', (req, res) => {
    res.render('welcome.ejs', {})
  })

  /* SHOW ADD PRODUCT FORM */
  router.get('/add', (req, res) => {
    res.render('search_not_found.ejs', {})
  })
  router.post('/add', (req, res) => {
    res.render('search_not_found.ejs', {})
  })
})

module.exports = router;


async function createUser() {
  try{
      // Use the collection "Users"
      const col = db.collection("Users");

      var jsonData = {
          "name": document.getElementById("name").value,
          "firstName" : document.getElementById("firstname").value,
          "adressLine" : document.getElementById("addressline").value,
          "userName" : document.getElementById("username").value,
          "email" : document.getElementById("email").value,
          "password" : document.getElementById("password").value
      };
      console.log(jsonData);
      // Insert a single document, wait for promise so we can read it back
      const p = await col.insertOne(jsonData);

      // Find one document
      const myDoc = await col.findOne();

      // Print to the console
      console.log(myDoc);
  }catch(err){
      console.error(err.stack);
  }
}