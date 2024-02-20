const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:{type: String, required:true, maxLength: 30},
    lastName:{type: String, required:true, maxLength: 30},
    email:{type: String, required:true, maxLength: 50},
    password:{type: String, required:true},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;