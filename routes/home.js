var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
const client = new MongoClient(connstring);
var db;
var dbName = "SWS_DB";
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
    if(true){
      //console.log(req);
      var jsonData = {
        "name": [req.body.name],
        "firstname" : [req.body.firstname],
        "adressline" : [req.body.adressline],
        "username" : [req.body.username],
        "email" : [req.body.email],
        "password" : [req.body.password]
      };
      console.log(jsonData);
      createUser(req).catch(console.dir);
      res.redirect('/home/welcome');
    }
  })

  /* SHOW WELCOME PAGE */
  router.get('/welcome', (req, res) => {
    res.render('welcome.ejs', {})
  })
})

module.exports = router;


async function createUser(req) {
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