var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home page' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About us' });
});

router.get('/help', function(req, res, next) {
  res.render('help', { title: 'Help page' });
});

module.exports = router;
