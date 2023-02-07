var express = require('express');
var router = express.Router();
const auth = require('../auth');
const db = require("../database");

router.get('/',auth.authenticateToken, function(req, res, next) {
  const user = req.user;

  res.render('menu', { title: 'Virtual Booth Menu', user: user, footer: 'Virtual Booth Corp' });
});

router.get('/studio',auth.authenticateToken, function(req, res, next) {
  const user = req.user;
  res.render('virtual-booth', { title: 'Virtual Booth Menu', user: user, footer: 'Virtual Booth Corp' });
});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
