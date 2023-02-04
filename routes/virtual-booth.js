var express = require('express');
var router = express.Router();
const auth = require('../auth');

/* GET users listing. */
router.get('/',auth.authenticateToken, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
