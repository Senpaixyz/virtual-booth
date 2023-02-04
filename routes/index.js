var express = require('express');
const db = require("../database");
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Booth', footer: 'Virtual Booth Corp' });
});

router.post('/create', function(req, res, next) {


  db.createUser('John Doe','Lolo', 'johndoe@example.com');
  db.closeDB();
});


module.exports = router;
