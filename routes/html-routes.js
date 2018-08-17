

var db = require('../models');

module.exports = function (app) {

    // Hit the main route
    app.get('/', function (req, res) {
        res.render('landing');
    });

    // hit users home page
    app.get('/home', function (req, res) {
        //get all the tags from the database

        setTimeout(function () {
            db.tagObj.findAll({
            }).then(function (tags) {
                let tagArray = [];
                // store the tags in an array without duplicates
                tags.forEach((tag) => {
                    let tagName = tag.dataValues.tagName;
                    if (tagArray.indexOf(tagName) === -1) {
                        tagArray.push(tagName);
                    }

                });
                // pass the array into handlebars
                let tagObject = {
                    tags: tagArray,
                };
                // render the home page with the tags
                res.render('home', tagObject);
            });
        }, 300);
 
    });
};
