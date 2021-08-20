//#region Variables and Constants
var express = require('express');
var router = express.Router();
var dbName = "securitySite";


const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://securitySiteAdmin:HtvT6h1782xGEhzw@cluster0.qrmeb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useUnifiedTopology=true";
const client = new MongoClient(connstring);
const signups = require("../public/js/signup");
const BREACHED_PASSWORD_TEXT = "Your password must not be contained in the list of breached passwords";
// get crypto module
const crypto = require("crypto");
//#endregion

//#region get and post routers
/* SHOW LOGIN PAGE */
router.get('/', (req, res) => {
    res.render('login.ejs')
    console.log(signups.sha256("Hello"))
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
        login(req, res);
    })
    //#endregion

//#region Extra functions
/**
 * Calling the login function to see if the combo exists
 * @param {*} req required that has all data from previous page (used for getting name and body)
 * @param {*} res result that can and will be used to go to the new page
 * @returns a promise so we wait for the "then" to complete and give the boolean back
 */
async function login(req, res) {
    username = [req.body.username].toString();
    password = signups.sha256([req.body.password].toString());
    var loginIsOK = await findUser(username, password).then(
        (response) => {
            if (loginIsOK !== null) {
                console.log("Log in succeeded");
                res.redirect('/home/welcome');
            } else {
                console.log("3.    login = false (something went wrong)");
                res.render('login.ejs', {}); // Redirect to login page on error
            }
            return response;
        }).catch(
        error => console.error('On get API Answer' + error, error)
    );
}

/**
 * Finding a user in the mongo DB to check if it exists
 * @param {String} username the username given by the user
 * @param {String} password the password given by the user
 * @returns a promise so we wait for the "then" to complete and give the boolean back
 */
async function findUser(username, password) {
    var found = null;
    try {

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Use the collection "Users"
        const col = db.collection("users");
        found = await col.findOne({
            $and: [{
                "username": username
            }, {
                "password": password
            }]
        })
        console.log("Found user", found);
    } catch (error) {
        console.log("login failed");
        //console.log(error.stack);
    } finally {
        await client.close();
        console.log("Client has closed");
    }
}

/**
 * Creating a user in the mongo database
 * @param {JSON} jsonData 
 */
async function createUser(jsonData) {
    try {
        await client.connect(); // Connect to the Mongoclient
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "Users"
        const col = db.collection("users");

        // Insert a single document, wait for promise so we can read it back if desired
        const p = await col.insertOne(jsonData);

    } catch (err) {
        console.log(err.stack); // Logging error if something were to go wrong
    } finally {
        await client.close(); // Close the client
    }
}

/**
 * Calling the signup function to see if password is alright
 * @param {*} req required that has all data from previous page (used for getting name and body)
 * @param {*} res result that can and will be used to go to the new page
 * @returns a promise so we wait for the "then" to complete and give the boolean back
 */
async function checkSignUpPlusCreateUser(req, res) {
    var signupIsOk = await signups.signup([req.body.password]).then(
            (response) => {
                if (response) {
                    console.log("3.    signup = true (succeeded)");

                    // Set up the jsonData to send to createuser
                    var jsonData = {
                        "name": [req.body.name].toString(),
                        "firstname": [req.body.firstname].toString(),
                        "adressline": [req.body.adressline].toString(),
                        "username": [req.body.username].toString(),
                        "email": [req.body.email].toString(),
                        "password": signups.sha256([req.body.password].toString())
                    };

                    createUser(jsonData).catch(console.dir); // CreateUser
                    res.redirect('/home/welcome'); // Redirect to welcome page
                } else {
                    console.log("3.    signup = false (something went wrong)");
                    res.render('signup.ejs', { 'errorInfo': BREACHED_PASSWORD_TEXT }); // Redirect to signup page on error
                }
                return response;
            }
        )
        .catch(error => console.error('On get API Answer' + error, error));
}
//#endregion

module.exports = router;