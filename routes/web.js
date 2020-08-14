const Router = require('express').Router();

Router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

Router.get('/users', function (req, res, next) {
  res.send('respond with a resource');
});


module.exports = Router;
