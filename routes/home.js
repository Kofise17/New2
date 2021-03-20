var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useUnifiedTopology=true";
const client = new MongoClient(connstring);
var dbName = "SWS_DB";
const functions = require("../public/js/functional1");
const signups = require("../public/js/signup");
const BREACHED_PASSWORD_TEXT = "Your password must not be contained in the list of breached passwords";

/* GET LOGINPAGE */
router.get('/', (req, res) => {
    res.render('login.ejs')
})

/* SHOW SIGNUP PAGE */
router.get('/signup', (req, res) => {
    res.render('signup.ejs', {})
})

/* ADD USER TO DB*/
router.post('/signup', (req, res) => {
  checkSignUpPlusCreateUser(req,res);
})

/* SHOW WELCOME PAGE */
router.get('/welcome', (req, res) => {
  res.render('welcome.ejs', {});
})

module.exports = router;


async function createUser(jsonData) {
  try {
    console.log("start connecting");
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


async function checkSignUpPlusCreateUser(req, res){
  var signupIsOk = await signups.signup([req.body.password]).then((response) => {return response;})
  .catch(error => console.error('On get API Answer'+ error, error));

    if(signupIsOk){
      console.log("3.    signup = true (succeeded)");
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
    }else{
      console.log("3.    signup = false (something went wrong)");
      res.render('signup.ejs', {'errorInfo': BREACHED_PASSWORD_TEXT});
    }
  return;
}