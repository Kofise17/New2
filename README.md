# Task Software security
Simple login and sign up app created with Node.js, and MongoDB

## Table of contents
* [General info](#general-info)
* [Running the project](#running-the-project)
* [Technologies](#technologies)
* [Sources](#sources)
* [Issues](#issues)
* [Developers](#developers)
* [Progress](#progress)

## General info
This project lets a user create a user which is safely stored in our private database at MongoDB.<br />
In case you already have created a user, you can login and the project will check if the user exists and if the given username and password are a valid combo.<br />
After being logged in, you will be guided to a welcome page with some text to show you have actually entered the site.

## Running the project
To run this project, just go to following url:
[swstask.herokuapp.com](https://swstask.herokuapp.com)

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
We couldn't use this one litterally because we had to write our own code. i did look through their source code to come up with some ideas on how to order the code.
2. [MongoDB Documentation](https://docs.atlas.mongodb.com) to find out how to set up our database, how to insert data into it and how to read out of it.
3. Of course multiple articles on [Stackoverflow](https://stackoverflow.com/) to get rid of numerous [errors](#issues)
4. [Heroku](https://devcenter.heroku.com/categories/nodejs-support) for help with setting up our site.

## Issues
### Programming languages
Firstly we used plain html and js but quickly we noticed that connecting to a database (and many other things) are way easier using Node.js.
That is why we switched to Node.js.
### Application platforms
The original site with the plain html and js was running on [Netlify](https://www.netlify.com/), but we noticed that deploying a Node.js app to Netlify isn't the easiest to do. So we changed to Heroku, this went way smoother.
### Deployment
We struggled a fair bit with the deployment of the Node.js app to Heroku, but in the end not a single article helped us. We looked through a lot of logs and eventually found a mistake (an unnecessary db connection made our site crash). It was easily solved by deleting the line.
### Asynchronous functions
Something that caused a serious headache was the fact that using axios to do the API request, makes your code asynchronous.<br />
What does that matter you might ask: well because of that the app said "okay this password is perfectly fine" and then a second or two later the api answer came through and the app realises "ohno it isn't perfectly fine at all" but by then it is already too late and you are on the welcome page. <br />
Now how did we solve this? By putting the keyword "async" infront of the function and putting "await" infront of the api call it actually makes your program wait for an answer. This does make the site slower, but a lot safer.

## Developers
This project was developed by:<br />
* Huseini "Kofi" Seidu
	* Email: huseini.seidu@student.ap.be
* Wout Vinckevleugel
	* Email: wout.vinckevleugel@student.ap.be

## Progress
- [x] Create Login 
- [x] Create Signup page
- [x] Create Welcome page
- [x] Post new users to DB
- [x] Show Welcome page after login/signup
- [x] Hash passwords to go in DB
- [ ] Show errors on page when password is too short
- [ ] Show errors on page when password is breached
- [ ] Show errors on page when password/username combo is wrong
- [ ] Make Erase button work
