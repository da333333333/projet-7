const mongoose = require('mongoose');
//const User = require('./User');

const postSchema = new mongoose.Schema(
  {
  //userId: { type: String, required: true },
  imageUrl: {type: String, required: false},
  post: { type: String, required: true },
  likes: {type:Number, default: 0},
  usersLiked: {type:Array, default: []},
    date : {type:Date, default: Date.now},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User"}

}
);
module.exports = mongoose.model('Post', postSchema);



