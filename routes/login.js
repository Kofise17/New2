var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const connstring = "mongodb+srv://Admin:Admin@cluster0.8cpdn.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
var db;

MongoClient.connect(connstring, {useUnifiedTopology: true}, (err, database) => {
  db = database.db('SWS_DB')
  if (err) return console.log(err)

  /* GET ALL PRODUCTS */
  router.get('/', (req, res) => {
    res.render('login.ejs')
  })

  /* SHOW ADD PRODUCT FORM */
  router.get('/add', (req, res) => {
    res.render('add.ejs', {})
  })

  /* ADD PRODUCT TO DB */
  router.post('/add', (req, res) => {
    db.collection('items').insertOne(req.body, (err, result) => {
      if (err) return
      res.redirect('/')
    })
  })

  /* SEARCH FORM */
  router.get('/search', (req, res) => {
    res.render('search.ejs', {})
  })

  /* FIND A PRODUCT */
  router.post('/search', (req, res) => {
  var query = { name: req.body.name }
  db.collection('items').findOne(query, (err, result) => {
    if (err) return
    if (result == '')
        res.render('search_not_found.ejs', {})
    else
        res.render('search_result.ejs', { product: result })
  });
  })

  /* DELETE A PRODUCT */
  router.post('/delete', (req, res) => {
    db.collection('items').findOneAndDelete({ id: req.body.id }, (err, result) => {
      if (err) return res.send(500, err)
      res.redirect('/')
    })
  })
})

module.exports = router;