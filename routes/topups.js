const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Topup = require('../models/topup');


//Login
router.get('/topups',function(req, res){
    res.render('topups');
});



//PRODUCT ROUTS
router.get('/',(req ,res) => {
    Topup.find()
    .select('-__v')
    .exec()
    .then(docs => {
         const response = {
             count : docs.length,
             topup : docs.map(doc=>{
                 return{
                     number: doc.number,
                     _id: doc._id,
                     request: {
                         type : 'GET',
                         url: req.protocol + '://' + req.get('host') + req.originalUrl + doc._id﻿
                     }
                 }
             })
         }
     if(docs.length >= 0){
             res.status(200).json(response)
         }else{
             res.status(404).json({
                 error : err
             })
         }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
});




router.post('/', (req ,res) => {
    console.log(req.body.number);
    const topup = new Topup({
        _id: new mongoose.Types.ObjectId(),
        number: req.body.number,
        description : req.body.description,
    });
    topup
    .save()
    .then(result =>{
            console.log(result);
            res.status(201).json({
                message : 'Added a new Product sucessfully',
                createdTopup : {
                    number: result.number,
                    _id: result._id,
                    request: {
                        type : "POST",
                        url: req.protocol + '://' + req.get('host') + req.originalUrl +"/"+ result._id﻿
                    }
                }
            })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error :err
        });
    });
});

module.exports = router;