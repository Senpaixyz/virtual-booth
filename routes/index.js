var express = require('express');
const db = require("../mysql_database");
const jwt = require('jsonwebtoken');
const auth = require('../auth');
const {v4 : uuidv4} = require('uuid');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    let title = process.env.title || 'Virtual Booth';
    res.render('index', { title: title, footer: 'Virtual Booth Corp' });
});

router.post('/create', async function(req, res, next) {
  try {
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;
    const speciality = req.body.speciality;
    const prc = req.body.prc;
    const terms_and_condition = req.body.terms_and_condition;

    const duplicatedUser = await db.getUserData('users',email);


    if(duplicatedUser.length > 0){
        console.log(duplicatedUser);
        throw new Error('Email Already Exists!');
    }
    else{
          const result = await db.insertData('users',
              {
                  first_name,
                  last_name,
                  email,
                  speciality,
                  prc,
                  terms_and_condition,
              },(result)=>{
              console.log(`Data Inserted Callback Success ${result}`)
          });

          let userId = uuidv4();

          const user = await db.getUserData('users',email);

          const token = jwt.sign(
              {
                    id: user.id,
                    firstName: first_name,
                    lastName: last_name,
                    email: email,
                    speciality: speciality,
                    prc: prc

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
        console.log(err);
        res.status(200).json({
          status: 'failed',
          message: err.message,
        });
  }



});

router.get('/get-users',async function(req, res, next) {

    try{
          const users = await db.getUsersData('users');

          res.status(200).json({
              status: 'success',
              message: 'Fetch Success',
              data: users
          });
    }
    catch(err){
        console.log(err);
        res.status(200).json({
            status: 'failed',
            message: err.message,
        });
    }
});




module.exports = router;
