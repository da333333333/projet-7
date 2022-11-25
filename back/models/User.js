const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Post = require('./Post');


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
