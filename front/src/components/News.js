import React from 'react';
import { useEffect, useState } from "react"
import Mypost from "../components/Mypost"
import noImage from "../assets/icon-left-font-monochrome-white.png"


const News = () => {


  const [postToEditId, setPostToEditId] = useState(null)
  const [posts, setPosts] = useState([])
  const userConnectedNowId = JSON.parse(localStorage.Groupomania).userId
  const isAdmin = JSON.parse(localStorage.Groupomania).isAdmin



  //--------------------------------------------------------ÉLABORATION  DATE-------------------- 
  const elaboratedDate = (post) => {
    let splittedDate = post.date.replace("T", "-").replace(".", "-").replaceAll(":", "-").split("-")
    let year = splittedDate[0]
    let month = splittedDate[1]
    let day = splittedDate[2]
    let hour = parseInt(splittedDate[3]) + 1
    let minute = splittedDate[4]
    let myElaboratedDate = day + "/" + month + "/" + year + " " + hour + "h" + minute
    return myElaboratedDate

  }

  //--------------------------------------------------------1ERE GET POSTS-------------------- 
  useEffect(() => { //affiche les post une seule fois au chargement de la page 

    const init = {
      headers: { authorization: "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token }
    }
    fetch("http://localhost:3001/api/posts", init)
      .then((response) => response.json())
      .then((result) => {
        setPosts(result.data)
      }) 
  }, []);


  //--------------------------------------------------------MISE A' JOUR NOUVEAU POST-------------------- 
  const newPostWasCreated = (_newPost) => {
    const _posts = [...posts]
    _posts.splice(0, 0, _newPost)
    setPosts(_posts)
  }

  //--------------------------------------------------------DELETE-------------------------------- 
  const deletePost = (postId) => {
    const init = {
      method: "DELETE",
      headers: { authorization: "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token }
    }
    fetch("http://localhost:3001/api/posts/" + postId, init)
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {

          let deletedPostIndex = posts.findIndex(function (posts) {
            return posts._id === postId;
          })
          const _posts = [...posts] //on trouve l'index du post effacé et on met a jour posts
          _posts.splice(deletedPostIndex, 1)
          setPosts(_posts)
        }
        else { return result.json; }
      })
  }


  //-----------------------------------------------EDIT (part news.js)------------------------------------
  const openEditPostForm = (i, postId) => {
    setPostToEditId(postId)
  }

  const quitEditMode = () => {
    setPostToEditId(null)
  }

  const postWasUpdated = () => {  //affichage post edité
    const initi = {
      headers: { authorization: "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token }
    }
    fetch("http://localhost:3001/api/posts/" + postToEditId, initi)
      .then((response) => response.json())
      .then((result) => {
        const updatedPost = result
        const _posts = [...posts]
        let postToEditIndex = []
        let i = 0
        while (postToEditIndex.length === 0) {
          if (_posts[i]._id === postToEditId) {
            postToEditIndex = i;
            _posts.splice(i, 1, updatedPost)
            setPosts(_posts)
          }
          else {
            i++
          }
        }
      })
  }
  //-----------------------------------------------LIKE------------------------------------
  const likePost = (i, postId) => {
    ILiktedIt(postId, i)
  }

  const ILiktedIt = (postId, index) => {
    const myLike = {
      userId: JSON.parse(localStorage.getItem("Groupomania")).userId,
    }
    const headers = new Headers()
    headers.append("content-type", "application/json")
    headers.append("authorization", "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token)

    const reqInit = {
      method: "post",
      body: JSON.stringify(myLike),
      headers: headers
    }
    fetch("http://localhost:3001/api/posts/" + postId + "/like", reqInit)
      .then(function (res) {
        return res.json()
      })
      .then(function (result) {
        const _posts = [...posts]

        if (result.addLike) { 
          _posts[index].likes++

        }
        else {
          _posts[index].likes--

        }
        setPosts(_posts)

      })
  }


//--------------------------------------------------RETURN---------------------------------------

  return (
    <div className='home_flex'>
      <Mypost newPostWasCreated={newPostWasCreated} postId={postToEditId} quitEditMode={quitEditMode} postWasUpdated={postWasUpdated} />
      <div className="news">
        <div className="flex_news">
          <h1>Dernières publications</h1>
          {posts.length === 0 ?
            <p id="new_posts">Rien à voir pour l'instant...</p>
            :
            <ul className="posts_list">
              {posts.map((post, i) => { console.log()

                return (
                  <div key={post._id} className="post_container" >
                    <h3 className="post_container_name">{post.author.email}</h3>
                    <h4 className="post_container_post">{post.post}</h4>
                    <img className='post_container_img' alt="image" src={post.imageUrl || noImage} />
                    <span className='post_flex'>
                      <h5 className="post_container_date">{elaboratedDate(post)}</h5>
                      {userConnectedNowId === post.author._id || isAdmin ?
                        <i onClick={(e) => openEditPostForm(i, post._id)} className="fa-xs fa-solid fa-pen"></i> : null}
                      {userConnectedNowId === post.author._id || isAdmin ?
                        <i onClick={(e) => deletePost(post._id)} className="fa-xs fa-solid fa-trash"></i> : null}
                      { <i onClick={(e) => likePost(i, post._id)} className='fa-xs fa-solid fa-heart fa' >  {post.likes}</i>                        }
                    </span>
                  </div>
                )
              })}
            </ul>
          }</div>
      </div>
    </div>
  )

}




export default News
