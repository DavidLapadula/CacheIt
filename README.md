# CACHE-IT

A playground for users to store, sort, and find information relating to Bookmarks and information in general. Users can search through 'tags' for information they find intersting, or add some information of their own. For programmers, this information can include code repositories and snippets as well.

## Motivation

This is a Full stack application that utilizes a variety of client-side and server-side tools. The project was designed to incorporate all areas of web development in one project to provide an easy to use and useful application. 


## Check it out here
If you want to see it live, check it out  [here](https://cacheittoday.herokuapp.com/)

## Screenshots

![](./public/images/cacheit.gif)


### NPM Dependencies

* body-parser: 1.16.0
* dotenv: 6.0.0
* express: 4.14.1
* express-handlebars: 3.0.0
* express-partials: 0.3.0
* express-session: 1.15.0
* method-override: 2.3.7
* mysql2: 1.6.1
* nodemon: 1.18.3
* passport: 0.4.0
* passport-local: 1.0.0
* path: 0.12.7
* sequelize: 4.38.0
* Mocha JavaScript test framework - [Documentation](https://mochajs.org/)
* Chai assertion library (v3.2.0) - [Documentation](http://www.chaijs.com/)

## Step-by-Step

* Update the settings in the "config.json" file for the database connection
* Copy the code from the "schema.sql" file and paste it to a new SQL tab in "MySQL Workbench". This sets up the cache_it.db database
* Run => "npm install" in the terminal to install the dependecies from the package.json file
* Run => "node server" in the terminal to start the server and connect to the database
* Visit localhost: 8080

## What the app does?

```
Reddit API 
```
  
  This feature provides a shortcut to reddit. How does it work? The user types the keyword(s) of interest in the search box, and the app lists the five most recent and voted posts on reddit.com, including post title and the date it was created, and links to view the posts, the reddit link and the source link.


## Running the tests

The app tests are located in the “test” directory in the project root. A breakdown of the test follows:

### tests.js
* a basic Chai Mocha test to test the npm Chai Mocha
* a test for the names of our app users
* a test for the reddit API

## Deployment
  
Cache-it was deployed using Heroku and it's JawsDB add-on:

https://cache-it.heroku.com/addons/jawsdb

## Built With

* Bootstrap
* Node.js
* Passport
* MySQL
* Sequelize
* Express Handlebars
* Express
* Heroku
* Reddit API - [Documentation](https://github.com/reddit-archive/reddit/wiki/API)

## Authors

* **Elizabeth Porter** - (https://github.com/ela-p-p)
* **Derek Irwin** - (https://github.com/derekirwin)
* **David Lapadula** - (https://github.com/davidlapadula)
* **Angelina Davies** - (https://github.com/angelyna)

## Acknowledgments

* Hat tip to our instructor, the TAs and several of our colleagues who had the kindness to share their knowledge with us along the way! 
* Inspiration and thanks to [stackoverflow](https://stackoverflow.com/).