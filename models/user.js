const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, 
        required: true, 
        index: true,
        unique: true, 
    },
    password: {type: String, required: false},
    firstName: {type : String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, 
        required: true, 
        index: true,
    },
    ecardID: {type: String, 
        required: true, 
        unique: true},
    cardCreds: {
        type: String, 
        required: true },
    balance: {
        type: Number, 
        required: true,
        }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;



