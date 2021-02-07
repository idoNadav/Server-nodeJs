const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    _id: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true
    },
    createdTime:{
        type: String,
        required:true
    },
    phoneNumber:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);
