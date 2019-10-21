const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/user');
const Product = require('../models/product');
const Topup = require('../models/topup');

//Get homepage
router.get('/',function(req, res){
    res.render('index');
});


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  }),
);

//Basic Info
router.get('/dashboard/info', ensureAuthenticated, (req, res) =>
  res.render('info', {
    user: req.user
  }),
);

//Top up options
router.get('/dashboard/topup', ensureAuthenticated, (req, res) =>
  res.render('topup', {
    user: req.user
  }),
);

//Buy your goods
router.get('/buy', ensureAuthenticated, (req, res) =>
  res.render('buy', {
    user: req.user    
  }),
);

  router.get('/dashboard/topup/option/:id',ensureAuthenticated,(req, res) =>{
    console.log(req.params.id);
    const optionID = req.params.id;
    Topup.findById(optionID)
    .select('number description')
    .exec()
    .then(doc => {
        console.log('Option from DB:' , doc);
        const option = doc;
        if(doc){
           res.render('topUpOption', {
             user: req.user,
             option : option,
           }),(req,res) 
        }else{
            res.status(404).json({
                message: 'Nothing was returned from the Option, ID does not exsist ' + optionID
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(404).json({
            error : err
        })
    });

 });



router.post('/dashboard/topup/option/:id', ensureAuthenticated,(req,res) =>{
  var currentBalace = req.user.balance;

  var optionID = req.params.id;
  console.log(optionID)
  let errors = [];
  const {inputCardCreds} = req.body;

  if(!inputCardCreds){
    errors.push({ msg: 'Please enter the card credentials' });

  }

  if (errors.length > 0) {
    res.redirect('/dashboard/topup/option/'+optionID,);
  }else{

  if(inputCardCreds.length !=4){
    req.flash('error_msg', 'Card credentials entered does not match the required length of 4 ');
    res.redirect('/dashboard/topup/option/'+optionID,);
  }else{
  
  if(inputCardCreds != req.user.cardCreds){
    req.flash('error_msg', 'Card credentials entered does not match');
    res.redirect('/dashboard/topup/option/'+optionID,);
  }else{
    
    Topup.findById(optionID)
    .select('number')
    .exec()
    .then(response =>{
        var topupValue = response.number;
  

  var balanceUpdate = topupValue;
  console.log("Will be updated with : " + balanceUpdate)
  var newBalance = currentBalace + balanceUpdate;
  var rounded_number = newBalance.toFixed(2)

  console.log(rounded_number + '  ' + currentBalace );
  User.findById({_id: req.user._id})
  .exec()
  .then(doc =>{
    if(doc){
      doc.balance = rounded_number;
      const updateOps = doc;

      User.update({_id : doc._id}, {$set : updateOps})
      .exec()
      .then(result => {
      
      req.flash('success_msg', 'Updated balance with £' + balanceUpdate);
      
      res.redirect('/dashboard');
  })
  .catch(err => {
    res.redirect('/dashboard', {'error_msg': 'Failed to make the transaction. Error message: ' + err });

  });

    }else{
      res.status(404).json({
          message: 'Error message: ' + err
      });
    }
  })
  .catch(err =>{
    console.error(err);
    
  })
  });
}}}
});



router.get('/transactionProduct/:id',ensureAuthenticated,(req, res) =>{
     console.log(req.params.id);
     const productID = req.params.id;
     Product.findById(productID)
     .select('productName price description productImage')
     .exec()
     .then(doc => {
         console.log('Product from DB:' , doc);
         const product = doc;
         if(doc){
            res.render('transactionProduct', {
              user: req.user,
              product : product,
            }),(req,res) 
         }else{
             res.status(404).json({
                 message: 'Nothing was returned from the Product, ID does not exsist'
             });
         }
     }).catch(err => {
         console.log(err);
         res.status(404).json({
             error : err
         })
     });

  });

router.get('/transactionProduct/:id/confirm',ensureAuthenticated,(req, res) =>{
    const productID = req.params.id;
    console.log(productID);
    const userBalance = req.user.balance;
    Product.findById(productID)
    .select('price')
    .exec()
    .then(response =>{
      if(response){
        if(userBalance >= response.price){
            var newUserBalance = userBalance - response.price;
            var tempUserObject = req.user;
            var rounded_number = newUserBalance.toFixed(2);
            tempUserObject.balance = rounded_number;

            User.update({_id : req.user._id}, {$set : tempUserObject})
            .exec()
            .then(result => {
                req.flash('success_msg', 'Transaction was successful');
                res.redirect('/dashboard');
             })
            .catch(err => {
               res.redirect('/dashboard', {'error_msg': 'Failed to make a transaction. Error message: ' + err });
            });

          }else{
            req.flash('error_msg', 'Insufficient funds. Please Top up');
            res.redirect('/dashboard/topup');
        }
      }else{
        req.flash(
          'error_msg',
          'Something went wrong: '+ err,
          redirect('/buy')
        );
      }
    })
    .catch(err =>{
      req.flash(
                'error_msg',
                'Something went wrong: '+ err,
                redirect('/buy')
              );
    });


  });


module.exports = router;