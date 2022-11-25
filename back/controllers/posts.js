const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');
const { post } = require('../routes/posts');
const User = require('../models/User')




exports.createPost = (req, res, next) => {
  const postObject = req.body;
  const _post = { ...postObject }
  if (req.file && req.file.filename) {
    _post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }
  const post = new Post(_post)
  post.save()
    .then((__post) => {
      User.findOne({_id:_post.author}).then(user=>{
        return res.status(201).json({ message: 'Objet enregistré !', data: __post, email: user.email })
      })

    })
    .catch(error => res.status(400).json({ error }));
};



exports.modifyPost = (req, res, next) => {

  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (!req.auth.isAdmin && post.author != req.auth.userId) { 
        return res.status(403).json({ error: "Acces refusé" })
      }
      let postObject = { ...req.body }
       if (req.file) { 
        postObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
       if (post.imageUrl && req.file) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
      else { 
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
      }
    }).catch(error => res.status(502).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (!req.auth.isAdmin && post.author != req.auth.userId) {
        return res.status(403).json({ error: "Acces refusé" })
      }
      if (post.imageUrl ) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
      else {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }))
      }
    })
};


exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).populate({ path: "author", options:{select: "email"} })
    .then(post => {

      res.status(200).json(post)
    })
    .catch(error => res.status(404).json({ error }));
};
exports.getAllPost = (req, res) => {
  Post.find()
  .sort([["date", "desc"]])
    .populate({ path: "author", options:{select: "email"} })
    .exec((error, posts) => {
      if(error){ 
        return res.status(500).json({error})
      }
      return res.status(200).json({ data: posts })
    })
    
  }
 


exports.likePost = (req, res, next) => {
  const postId = req.params.postId
  const userId = req.body.userId


  Post.findOne({ _id: postId })
    .then(post => {

      const likesIndex = post.usersLiked.indexOf(userId)
      let addLike
      if (likesIndex > -1) {
        addLike=false
        post.likes--;
        post.usersLiked.splice(likesIndex, 1)
      } else {
        post.likes++;
        addLike=true
        post.usersLiked.push(userId)
      }

      Post.updateOne({ _id: postId }, post)
        .then(() => res.status(200).json({ message: 'Objet modifié !', addLike }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));

};