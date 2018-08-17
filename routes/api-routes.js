

// Requiring our models and passport as we've configured it
let db = require('../models');
let moment = require('moment');


module.exports = function (app) {

  // add a cache bject
  app.post('/newPersSnip', function (req, res) {

    let extensionInput;

    // Check to see if request coming  from web page or extension
    if (typeof req.body === 'string') {
      extensionInput = JSON.parse(req.body);
    } else {
      extensionInput = req.body;
    }
    let { snipName, snipDesc, snipTag } = extensionInput;

    if (!snipName || !snipDesc || !snipTag) {
      res.sendStatus('400');
    } else {
      res.sendStatus('201');
      db.cacheObj.create({
        URL: snipName,
        text: snipDesc,
      })
        .then((snipID) => {
          db.tagObj.create({
            tagName: snipTag,
            cacheObjId: snipID.dataValues.id
          });
        });
    }
  });


  // search snippet by optional filters
  app.get('/getSnip/:param', function (req, res) {
    let param = req.params.param;

    let currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

    // param is all if user does not input a specific request
    if (param === 'all') {
      db.cacheObj.findAll({
        include: db.tagObj
      }).then(function (objects) {
        let caches = { renderedCaches: {} };
        objects.forEach((el) => {
          let tags = [];
          el.dataValues.tagObjs.forEach((el) => {
            tags.push(el.dataValues.tagName);
          });
          let cacheID = el.dataValues.id;
          let cacheDataObj = {
            URL: el.dataValues.URL,
            Text: el.dataValues.text,
            tagArray: tags,
            date: currentDate
          };
          caches.renderedCaches[cacheID] = cacheDataObj;
        });
        // send back a partial with layout set to false - so only HTML
        res.render('partials/home-cache-partials', Object.assign({ layout: false }, caches));
      });
    } else {
      // find all with a certin tag
      let cacheIds = [];
      db.tagObj.findAll({
        where: {
          tagName: param
        },
        include: db.cacheObj
      }).then(function (objects) {
        objects.forEach((el) => {
          cacheIds.push(el.dataValues.cacheObj.id);
        });
      }).then(function () {
        // get all the cache objects with a matching id to the foreign key of the tags chosen
        db.cacheObj.findAll({
          where: {
            id: cacheIds
          },
          include: db.tagObj
        }).then(function (objects) {
          // construct an object and render it in the partial
          let caches = { renderedCaches: {} };
          objects.forEach((el) => {
            let tags = [];
            el.dataValues.tagObjs.forEach((el) => {
              tags.push(el.dataValues.tagName);
            });
            let cacheID = el.dataValues.id;
            let cacheDataObj = {
              URL: el.dataValues.URL,
              Text: el.dataValues.text,
              tagArray: tags,
              date: currentDate
            };
            caches.renderedCaches[cacheID] = cacheDataObj;
          });
          // send back a partial with layout set to false - so only HTML
          res.render('partials/home-cache-partials', Object.assign({ layout: false }, caches));
        });

      });
    }
  });



  // add a tag to a specific snippet
  app.post('/newSnipTag', function (req, res) {
    let { newTag, snipID } = req.body;

    db.tagObj.findAll({
      where: {
        tagName: newTag,
        cacheObjId: snipID
      }
    }).then((match) => {
     // only create tag if it doesnt already exist
      if (!Array.isArray(match) || !match.length) {
        if (newTag && snipID) {
          db.tagObj.create({
            tagName: newTag,
            cacheObjId: snipID,
          })
            .then((snipID) => {
              res.sendStatus('201');
            })
            .catch(() => res.sendStatus('400'));
        } else {
          res.sendStatus('404');
        }
      } else {
        res.sendStatus('409');
      }
    });
  });


  // delete a tag from a specific snippet
  app.delete('/delSnipTag/', function (req, res) {
    let { snipID, removedTag } = req.body;

    if (snipID && removedTag) {
      db.tagObj.destroy({
        where: {
          cacheObjId: snipID,
          tagName: removedTag
        }
      })
        .then(function () {
          res.sendStatus('202');
        });
    } else {
      res.sendStatus('400');
    }

  });


  // delete an entire snippet
  app.delete('/delFullSnip/:snipID', function (req, res) {
    let snipID = req.params.snipID;

    if (!snipID) {
      res.sendStatus('400');
    } else {
      db.cacheObj.destroy({
        where: {
          id: snipID
        }
      })
        .then(function () {
          res.sendStatus('202');
        });
    }
  });


  // open external route to api
  app.get('/returnCaches/', function (req, res) {
    db.cacheObj.findAll({
    }).then(function (objects) {
      res.send(objects);
    });
  });

};


