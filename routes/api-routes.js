/* eslint-disable */

// Requiring our models and passport as we've configured it
var db = require("../models");

module.exports = function(app) {

// HOME PAGE 

// Personal cache routes

// add a new snippet
app.post("/newPersSnip", function (req, res) {
  let {snipName,  snipDesc, snipTag} = req.body; 

  if(!snipName || !snipDesc || !snipTag) {
    res.sendStatus('400');
  } else {
    res.sendStatus('201'); 
    console.log(snipName); 
    console.log(snipDesc);  
    console.log(snipTag); 

    db.cacheObj.create({
      URL: snipName,
      text: snipDesc,
  })
      .then((snipID) => {

          db.tagObj.create({
              tagName: snipTag, 
              cacheObjId: snipID.dataValues.id
          }); 
      })


  }
}); 


// search snippet by optional filters
app.get("/getSnip/:param", function (req, res) {
    let param = req.params.param;

    if (param === 'all') {
      db.cacheObj.findAll({
        include: db.tagObj
      }).then(function (objects) {

        let caches = { renderedCaches : {}}
 
        objects.forEach((el) => {
          let tags = []; 
          el.dataValues.tagObjs.forEach((el) => {
              tags.push(el.dataValues.tagName)
          })
          let cacheID = el.dataValues.id; 
          let cacheDataObj = {
            URL : el.dataValues.URL, 
            Text : el.dataValues.text, 
            tagArray : tags
          }
          caches.renderedCaches[cacheID] = cacheDataObj; 
        }); 
        res.render('partials/home-cache-partials', Object.assign({layout : false}, caches))

      })
    } else {

      let cacheIds = [];  


      db.tagObj.findAll({
        where: {
          tagName : param
        }, 
        include: db.cacheObj
      }).then(function (objects) {
        objects.forEach((el) => {
         cacheIds.push(el.dataValues.cacheObj.id)
        }); 

        console.log(cacheIds)
      }).then (function () {

        db.cacheObj.findAll({
          where : {
            id : cacheIds
          }, 
          include: db.tagObj
        }).then(function (objects) {
              let caches = { renderedCaches : {}}
 
        objects.forEach((el) => {
          let tags = []; 
          el.dataValues.tagObjs.forEach((el) => {
              tags.push(el.dataValues.tagName)
          })
          let cacheID = el.dataValues.id; 
          let cacheDataObj = {
            URL : el.dataValues.URL, 
            Text : el.dataValues.text, 
            tagArray : tags
          }
          caches.renderedCaches[cacheID] = cacheDataObj; 
        }); 
        res.render('partials/home-cache-partials', Object.assign({layout : false}, caches))
        }); 

      }); 
    }



}); 



// add a tag to a specific snippet
app.post("/newSnipTag", function (req, res) {
  let {newTag, snipID} = req.body; 

  if (newTag && snipID) {
    db.tagObj.create({
      tagName: newTag,
      cacheObjId: snipID,
  })
      .then((snipID) => {
  
        console.log(newTag, snipID)
        res.sendStatus('201'); 
      })
      .catch(() => res.sendStatus('400'));

  } else (
    res.send('404')
  )


}); 


// delete a tag from a specific snippet
app.delete("/delSnipTag/", function (req, res) {
  let {snipID, removedTag } = req.body; 

  console.log(snipID)
  console.log(removedTag)

  if(snipID && removedTag) {
    db.tagObj.destroy({
      where: {
          cacheObjId: snipID, 
          tagName: removedTag

      }
  })
      .then(function () {
          res.sendStatus('202')
      });
  } else {
    res.sendStatus('400'); 
  }

});  


// delete an entire snippet
app.delete("/delFullSnip/:snipID", function (req, res) {
  let snipID = req.params.snipID; 

  if(!snipID) {
    res.sendStatus('400');
  } else {
    db.cacheObj.destroy({
      where: {
          id: snipID
      }
  })
      .then(function () {
          res.sendStatus('202')
      });
  }
}); 



};