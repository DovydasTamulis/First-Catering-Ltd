const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: { type : String, required: true},
    price: { type : Number, required: true},
    description: {type: String, require: false},
    productImage : {type : String, require: true}
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
