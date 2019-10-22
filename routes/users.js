const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
const User = require('../models/user');



//Register
router.get('/register',function(req, res){
    res.render('register');
});

//Login
router.get('/login',function(req, res){
    res.render('login');
});



//Register
router.post('/register',function(req, res){
    const { firstName, lastName, email, phoneNumber, ecardID, cardCreds} = req.body;
    let errors = [];

    if (!firstName || !lastName || !email || !phoneNumber || !ecardID || !cardCreds) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
      if (errors.length > 0) {
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          phoneNumber,
          ecardID,
          cardCreds,
        });
      } else {
        User.find({ecardID: ecardID})
        .then(user =>{
            if(user.length >= 1){
                 req.flash('success_msg', 'Your account is already created. Please login with ' + req.body.ecardID);
                 console.log("Your account is already created. Please login with " + req.body.ecardID);
                 res.redirect('/users/login');
                }else{
                  if(cardCreds.length != 4){
                    req.flash('error_msg', 'Card credentials length does not match criteria ' + req.body.cardCreds.length);
                    res.redirect('/users/register',);
                  // }else if(typeof icardCreds != "number"){
                    // req.flash('error_msg', 'Card credentials entered is not a number ' + req.body.cardCreds);
                    // res.redirect('/users/register',);
                  }
                  
                  User.find({email: req.body.email}).then(resultEmail =>{
                    if(resultEmail.length >=1){
                      req.flash('error_msg', 'Email allready in use: ' + req.body.email);
                      res.redirect('/users/register',);
                    }
                  });
             

                  if(ecardID.length != 16){
                    req.flash('error_msg', 'E-Card ID should be exactly 16 values: ' + req.body.ecardID.length);
                    res.redirect('/users/register',);

                  }else{
                const newUser = new User({
                    _id : new mongoose.Types.ObjectId,
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    ecardID,
                    cardCreds,
                    balance : 0
                });  

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.ecardID, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser.save()
                        .then(user => {
                          req.flash(
                            'success_msg',
                            'You are now registered and can login with: ' + user.ecardID
                          );
                          res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
              }
              
            }
            }); 
          }
        });

  

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res);
});


//Logout
router.get('/logout',function(req, res){
    req.logout();
    req.flash('success_msg', 'You have logged out. GoodBye');
    res.redirect('/');
});


module.exports = router;