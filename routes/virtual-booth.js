var express = require('express');
var router = express.Router();
const auth = require('../auth');
const db = require("../mysql_database");
require('dotenv').config();
router.get('/',auth.authenticateToken, function(req, res, next) {
  const user = req.user;


  res.render('menu', {
    title: process.env.APP_NAME,
    user: user,
    footer: process.env.APP_NAME,
    isLogged: true,
    chatbot_api: process.env.CHATBOT_PUBLIC_API
  });
});

router.get('/studio',auth.authenticateToken, function(req, res, next) {
  const user = req.user;
  res.render('virtual-booth', {
    title: process.env.APP_NAME,
    user: user,
    footer: process.env.APP_NAME,
    isLogged: true,
    chatbot_api: process.env.CHATBOT_PUBLIC_API
  });
});

router.get('/get-user',auth.authenticateToken, async function(req, res, next) {
  try{
    const userRequest = req.user;

    const userData = await db.getUserData('users',userRequest.email);
    const user = userData[0];


    if(user.first_logged){
      // set first logged to false;
      db.updateData(
          'users',
          {
            first_logged: 0
          },
          `id=${user.id}`,
          (result)=>{
            console.log(`First Logged Updated to false: ${result}`)
          }
      );
    }

    res.status(200).json({
       status: 'success',
       message: 'User Fetch Success',
       info: {
         first_name: user.first_name,
         last_name: user.last_name,
         speciality: user.speciality,
         prc: user.prc,
         first_logged: user.first_logged
       }
    });
  }
  catch(err) {
    console.log(err);
    res.status(200).json({
      status: 'failed',
      message: err.message,
      info: {}
    });
  }


});


router.get('/logout',auth.authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
