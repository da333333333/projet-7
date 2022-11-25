import React, { useEffect, useState } from "react";

const Mypost = (props) => {

  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState("");
//---------------------------------------COPIER LES CHAMPS---------------------------------------------
  useEffect(() => {// pour copier les champs du post à modifier dans le post "editable" à gauche
    if (props.postId) { //s'active si la props passée et contenant l'id du post à modifier existe.
      const initi = {
        headers: {
          authorization:
            "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token,
        },
      };
      fetch("http://localhost:3001/api/posts/" + props.postId, initi) //affichage nouveau post getOne
        .then((response) => response.json())
        .then((result) => {
          setMessage(result.post);
          setImageUrl(result.imageUrl);
        });
    }
  }, [props.postId]);


  //--------------------------------------CONTRôLE: post soumis est vide? ---------------------------------
  const messageControl = (e) => {
    e.preventDefault();
    if (message !== "") {
      if (props.postId) {
        editMyMessage();
      } else {
        postMyMessage();
      }
    } else {
      alert("Votre message est vide");
    }
  };

//--------------------------------------EDIT: le post soumis n'est pas vide (CONTRôLE OK) ---------------------------------
  function editMyMessage() {
    const formData = new FormData();
    formData.append(
      "author",
      JSON.parse(localStorage.getItem("Groupomania")).userId
    );
    formData.append("post", message);
    formData.append("image", imageFile);
    const headers = new Headers();
    //headers.append("content-type", "application/json")
    headers.append(
      "authorization",
      "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token
    );
    const reqInit = {
      method: "put",
      body: formData,
      headers: headers,
    };
    fetch("http://localhost:3001/api/posts/" + props.postId, reqInit)
      .then(function (res) {
        return res.json();
      })
      .then(function (result) {
//met à jour les post affichés quand un post est modifié (dans NEWS.JS)
        props.postWasUpdated()
        resetFormQuit()
       
      });
  }
//--------------------------------------EDIT: modifier le message ---------------------------------
  const recordMessage = (e) => {
    const _message = e.target.value;
    setMessage(_message);
  };
//--------------------------------------EDIT: modifier la photo ---------------------------------
  const inputFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (evt) => {
      setImageUrl(evt.target.result);
    };
  };
  
  //--------------------------------------POST: le post soumis n'est pas vide ---------------------------------
  function postMyMessage() {
    const formData = new FormData();
    formData.append(
      "author",
      JSON.parse(localStorage.getItem("Groupomania")).userId
    );
    formData.append("post", message);
    formData.append("image", imageFile);
    const headers = new Headers();
    headers.append(
      "authorization",
      "Bearer " + JSON.parse(localStorage.getItem("Groupomania")).token
    );
    const reqInit = {
      method: "post",
      body: formData,
      headers: headers,
    };
    fetch("http://localhost:3001/api/posts", reqInit)
      .then(function (res) {
        return res.json();
      })
      .then(function (result) {
        const userId = result.data.author
        props.newPostWasCreated({...result.data, author:{_id: userId, email: result.email}}); //met à jour les post affichés quand un nouveau post est crée
        resetFormQuit()
      });
  }



  //--------------------------------------RESET champs form ---------------------------------
  const resetFormQuit = () => { 
    setMessage("");
    setImageUrl("");
    setImageFile(null)
    props.quitEditMode();
  };

//--------------------------------------------------RETURN---------------------------------------

  return (
    <div className="my_post">
      <span className="form_home">
        <form className="home_button_container" onSubmit={(e) => messageControl(e)}>
          <textarea
            placeholder={"Quoi de neuf?"}
            onChange={recordMessage}
            id="my_message"
            value={message}
          />
          <label className="home_button" htmlFor="file">
            {" "}
            Ajouter une photo
            <input
              style={{ display: "none" }}
              onChange={inputFileChange}
              type="file"
              id="file"
              multiple
              accept=".jpg, .jpeg, .png"
            />
          </label>
          {imageUrl && <img alt="mon image" src={imageUrl} />}
          <button type="submit" className="home_button" id="submit_post">
            {props.postId ? "Modifier" : "Envoyer"}
          </button>

        </form>
   
        {props.postId && (
          <button onClick={resetFormQuit} className="home_button">
            Quitter le mode édition
          </button>
        )}</span>
    </div>
  );
};


export default Mypost;
