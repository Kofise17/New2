var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(connstring);
var dataB;
var dbName = "SWS_DB";
const functions = require("../public/js/functional1");
const signups = require("../public/js/signup");
var crypto = require('crypto')
var shasum = crypto.createHash('sha1');

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
  if(signups.signup([req.body.password])){
    console.log("signup = true (succeeded)");
    //console.log(req);
    var jsonData = {
      "name": [req.body.name].toString(),
      "firstname" : [req.body.firstname].toString(),
      "adressline" : [req.body.adressline].toString(),
      "username" : [req.body.username].toString(),
      "email" : [req.body.email].toString(),
      "password" : signups.SHA1([req.body.password])
    };
    //console.log(jsonData);
    createUser(jsonData).catch(console.dir);
    res.redirect('/home/welcome');
  }
  else{
    console.log("signup = false (something went wrong)");
    res.render('search_not_found.ejs', {})
  }
})

/* SHOW WELCOME PAGE */
router.get('/welcome', (req, res) => {
  res.render('welcome.ejs', {})
})

module.exports = router;


async function createUser(jsonData) {
  //console.log(res);
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);

    // Use the collection "people"
    const col = db.collection("Users");

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(jsonData);

  } catch (err) {
    console.log(err.stack);
  }

  finally {
    await client.close();
  }
}