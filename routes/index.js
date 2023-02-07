var express = require('express');
const db = require("../database");
const jwt = require('jsonwebtoken');
const auth = require('../auth');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Booth', footer: 'Virtual Booth Corp' });
});

router.post('/create', async function(req, res, next) {
  try {
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;

    const duplicatedUser = await db.getUser(email);

    if(duplicatedUser.length >= 1){
      // db.closeDB();
      throw new Error('Email Already Exists!');
    }
    else{
      db.createUser(first_name,last_name, email);

      const user = await db.getUser(email);

      const token = jwt.sign(
          {
            id: user.id,
            firstName: first_name,
            lastName: last_name,
            email: email
          },
          auth.secret,
          { expiresIn: '3h' });

      // db.closeDB();
      res.status(200).json({
        status: 'success',
        token: token,
        message: 'Redirecting to Virtual Booth',
      });
    }

  }
  catch(err) {
    res.status(200).json({
      status: 'failed',
      message: err.message,
    });
  }



});

router.get('/get-users',async function(req, res, next) {

    try{
      const users = await db.getUsers();

      res.status(200).json({
          status: 'success',
          message: 'Fetch Success',
          data: users
      });
    }
    catch(err){
      res.status(200).json({
        status: 'failed',
        message: err.message,
      });
    }
});




module.exports = router;
