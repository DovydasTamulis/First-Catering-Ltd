const mongoose = require('mongoose');

const topupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: { type : Number, required: true},
    description: { type : String, required: true},

});


const Topup = mongoose.model('Topup', topupSchema);
module.exports = Topup;
