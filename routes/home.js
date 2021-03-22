//#region Variables and Constants
var express = require('express');
var router = express.Router();
var dbName = "SWS_DB";

const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useUnifiedTopology=true";
const client = new MongoClient(connstring);
const functions = require("../public/js/functional1");
const signups = require("../public/js/signup");
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

/* AFTER LOGIN BUTTON PUSH */
router.post('/welcome', (req, res) => {
    console.log([req.body.username].toString())
    console.log(signups.SHA1([req.body.password]))
    login(req, res);

})

/* login */
async function login(req, res) {
    username = [req.body.username].toString();
    password = signups.SHA1([req.body.password]);
    var loginIsOK = await findUser(username, password).then((response) => { return response; })
        .catch(error => console.error('On get API Answer' + error, error));

    console.log(loginIsOK);
    if (loginIsOK !== null) {
        console.log("Log in succeeded");
        res.redirect('/home/welcome');
    } else {
        console.log("3.    login = false (something went wrong)");
        res.render('login.ejs', {}); // Redirect to signup page on error
    }
    return;
}

/*FIND USER IN DB*/
async function findUser(username, password) {
    var found = null;
    try {

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Use the collection "Users"
        const col = db.collection("Users");
        found = await col.findOne({
            $and: [{
                "username": username
            }, {
                "password": password
            }]
        })
        console.log(found);
    } catch (error) {
        console.log("login failed");
        await client.close();
        //console.log(error.stack);
    } finally {
        await client.close();
        console.log("Client has closed");
    }
    return found;
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