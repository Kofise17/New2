# Task Software security
Simple login and sign up app created with Node.js, and MongoDB.<br />
All the files have been commented thoroughly to make everything understandable.

## Table of contents
* [General info](#general-info)
* [Running the project](#running-the-project)
* [Technologies](#technologies)
* [Sources](#sources)
* [Issues](#issues)
* [Developers](#developers)
* [A few functions](#a-few-functions)

## General info
This project lets an enduser create a user which is safely stored in our private database at MongoDB.<br />
In case you already have created a user, you can login and the project will check if the user exists and if the given username and password are a valid combo.<br />
After being logged in, you will be guided to a welcome page with some text to show you have actually entered the site.

## Running the project
To run this project, just go to following URL: [swstask.herokuapp.com](https://swstask.herokuapp.com)

## Technologies
Project was created with:
* Node version: 12.16.2
* Npm version: 	6.14.9
* Github
* Heroku

## Sources
Used dependencies are easily found by looking in the package.json file.

Other sources used for inspiration:<br />
1. [Passprotect](https://github.com/OktaSecurityLabs/passprotect-js) a handy tool that looks if a password or email on the page is breached.
We couldn't use this one litterally because we had to write our own code. We did look through their source code to come up with some ideas on how to order the code.
2. [MongoDB Documentation](https://docs.atlas.mongodb.com) to find out how to set up our database, how to insert data into it and how to read out of it.
3. Of course multiple articles on [Stackoverflow](https://stackoverflow.com/) to get rid of a few [errors](#issues).
4. [Heroku](https://devcenter.heroku.com/categories/nodejs-support) for help with setting up our site.

## Issues
Of course we had a lot of issues while building this (it's a learning experience after all), so here are the biggest ones we've encountered.
### Programming languages
Firstly we used plain html and JavaScript but quickly we noticed that connecting to a database (and many other things) are way easier using Node.js.
That is why we switched to Node.js.
### Application platforms
The original site with the plain html and js was running on [Netlify](https://www.netlify.com/), but we noticed that deploying a Node.js app to Netlify isn't the easiest to do. So we changed to Heroku, this went way smoother.
### Deployment
We struggled a fair bit with the deployment of the Node.js app to Heroku, but in the end not a single article helped us. We looked through a lot of logs and eventually found a mistake (an unnecessary db connection made our site crash). It was easily solved by deleting the line.
### Asynchronous functions
Something that caused a serious headache was the fact that using axios to do the API request, makes your code asynchronous.<br />
"What does that matter?", you might ask. Well because of that, the app said "okay this password is perfectly fine" and then a second or two later the API answer came through and the app realises "ohno it isn't perfectly fine at all" but by then it was already too late and you are on the welcome page.<br />
Now, how did we solve this? By putting the keyword "async" infront of the function and putting "await" infront of the API call it actually makes your program wait for an answer. This does make the site slower, but a lot safer.

## A few functions
Regarding the stress on security this assignment here follow a few of the most important functions we wrote:
### CheckPsswdIsbreached()
As the name suggest (as should be with function names) this function will chek if the password entered by the user comes up in the "Have I Been Pwned"(HIBP) database.<br />We will then iterate over the response and if we find a match with your password, it has been breached and thus may not be used.
````
// the URL below gives a json response with 500 lines of hashed passwords (hashed in SHA1)
const apiAnswer = axios.get(`${HIBP_API_URL}/${prefix}`)
        .then(response => {
            var responseOnePerLine = response.data.split("\n");

            // Run over those 500 lines
            for (var i = 0; i < responseOnePerLine.length; i++) {
                var data = responseOnePerLine[i].split(":");

                // if the suffix is found in tis list, it's been breached
                if (data[0].toLowerCase() == suffix) {
                    return result = true;
                }
            }
            return result;
        })
        .catch(error => console.error('On get API Answer error', error));
````

### findUser()
This function is used on the login page of our application. When the user clicks on the login button, the program will try to find a user with given username and password combo in the database. If it doesn't find a match, it doesn't exist and you'll have to try again.
````
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
        //console.log(found);
    } catch (error) {
        console.log("login failed");
        //console.log(error.stack);
    } finally {
        //await client.close();
        console.log("Client has closed");
    }
 ````
### Other functions
We won't be showing every single function we used in this document, if you would like to know more about a function we did our best to put enough clear comments in the code itself. We encourage you to search them and in case of questions [ask us](#developers)!
## Developers
This project was developed by:<br />
* Huseini "Kofi" Seidu
	* Email: huseini.seidu@student.ap.be
* Wout Vinckevleugel
	* Email: wout.vinckevleugel@student.ap.be
