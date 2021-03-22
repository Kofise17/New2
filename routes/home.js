//#region Variables and Constants
var express = require('express');
var router = express.Router();
var dbName = "SWS_DB";

const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useUnifiedTopology=true";
const client = new MongoClient(connstring);
const functions = require("../public/js/functional1");
const signups = require("../public/js/signup");
const login = require("../public/js.login");
const BREACHED_PASSWORD_TEXT = "Your password must not be contained in the list of breached passwords";
//#endregion

/* SHOW LOGIN PAGE */
router.get('/', (req, res) => {
    res.render('login.ejs')
})

/* SHOW SIGNUP PAGE */
router.get('/signup', (req, res) => {
    res.render('signup.ejs', {})
})

/* SHOW WELCOME PAGE */
router.get('/welcome', (req, res) => {
    res.render('welcome.ejs', {});
})

/* AFTER SIGNUP BUTTON PUSH */
router.post('/signup', (req, res) => {
    checkSignUpPlusCreateUser(req, res);
})

/*FIND USER IN DB*/
async function findUser() {
    try {

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "USers"
        const col = db.collection("Users");
        col.findOne({
            $and: [
                { username: [req.body.username].toString() },
                { password: login.SHA1([req.boy.password]) }
            ]
        })
    } catch (error) {
        console.log(error.stack)
    } finally {
        await client.close();
    }
}
/* ADD USER TO DB */
async function createUser(jsonData) {
    try {
        await client.connect(); // Connect to the Mongoclient
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "Users"
        const col = db.collection("Users");

        // Insert a single document, wait for promise so we can read it back if desired
        const p = await col.insertOne(jsonData);

    } catch (err) {
        console.log(err.stack); // Logging error if something were to go wrong
    } finally {
        await client.close(); // Close the client
    }
}

/* CHECK IF THE SIGNUP INFO IS POSSIBLE */
async function checkSignUpPlusCreateUser(req, res) {
    /**
     * Calling the signup function to see if password is alright
     * @returns a promise so we wait for the "then" to complete and give the boolean back
     */
    var signupIsOk = await signups.signup([req.body.password]).then((response) => { return response; })
        .catch(error => console.error('On get API Answer' + error, error));

    // If the password is alright go further
    if (signupIsOk) {
        console.log("3.    signup = true (succeeded)");

        // Set up the jsonData to send to createuser
        var jsonData = {
            "name": [req.body.name].toString(),
            "firstname": [req.body.firstname].toString(),
            "adressline": [req.body.adressline].toString(),
            "username": [req.body.username].toString(),
            "email": [req.body.email].toString(),
            "password": signups.SHA1([req.body.password])
        };

        createUser(jsonData).catch(console.dir); // CreateUser
        res.redirect('/home/welcome'); // Redirect to welcome page
    } else {
        console.log("3.    signup = false (something went wrong)");
        res.render('signup.ejs', { 'errorInfo': BREACHED_PASSWORD_TEXT }); // Redirect to signup page on error
    }
    return;
}

module.exports = router;