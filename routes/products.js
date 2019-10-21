const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./img');
    },
    filename: function(req, file, cb){
        cb(null,  file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    //reject
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);

    }else{
        cb(new Error('Cant load the file'), false);
    }

};

const upload = multer({
    storage: storage, 

    fileFilter: fileFilter
});


//PRODUCT ROUTS
router.get('/',(req ,res , next) => {
    Product.find()
    .select('-__v')
    .exec()
    .then(docs => {
         const response = {
             count : docs.length,
             products : docs.map(doc=>{
                 return{
                     name : doc.name,
                     price: doc.price,
                     _id: doc._id,
                     productImage: doc.productImage,
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




router.post('/', upload.single('productImage'), (req ,res , next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        price: req.body.price,
        productImage : req.file.path,
        description : req.body.description,
    });
    product
    .save()
    .then(result =>{
            console.log(result);
            res.status(201).json({
                message : 'Added a new Product sucessfully',
                createdProduct : {
                    name: result.name,
                    price: result.price,
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

// //ID PRODUCT ROUTS
router.get('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage description')
    .exec()
    .then(doc => {
        console.log('Product from DB:' , doc);
        if(doc){
            res.status(200).json({doc});

        }else{
            res.status(404).json({
                message: 'Not a valid ID sent to DB'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
});


router.patch('/:productId',(req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps)
    console.log(id);
    console.log({_id : id}, {$set : updateOps})
    Product.update({_id : id}, {$set : updateOps}).exec().then(result => {
        console.log(result)
        res.status(200).json({
            message : 'Updated product',
            request:{
                type: 'GET',
                // url: req.protocol + '://' + req.get('host') + req.originalUrl + req.params.productId
                url: req.protocol + '://' + req.get('host') + req.originalUrl

            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            erorr : err
        })
    });
});

router.delete('/:productId', (req,res,next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Sucessfully deleted product ' + req.params.productId,
            result: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
});

module.exports = router;