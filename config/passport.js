const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'ecardID', passwordField: 'ecardID'}, (ecardID, password, done) => {
      password = ecardID;

      // Match user
      User.findOne({
        ecardID: ecardID
      }).then(user => {
        if (!user) {
          if(ecardID.length != 16){
            return done(null, false, { message: 'E-Card: '+ ecardID +' does not meet 16 character length' });

          }else{
            return done(null, false, { message: 'E-Card: '+ ecardID +' is not registered' });

          }
        }else{
        //Compare the password to the E-Card ID
        bcrypt.compare(password, user.password, (err, result) =>{
          if (err) throw err;
         
          if (result) {
            console.log("Successfully connected with ID: " , ecardID);
            return done(null, user,{ message: 'Password incorrect' });
          } else {
            console.log(ecardID);
            return done(null, false, { message: 'Password incorrect' });
          
        }
        });
        }
    })

  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
    done(err, user);
  });
});
};