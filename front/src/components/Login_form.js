import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Loginform = () => {
    const navigation = useNavigate()
    const [user, setUser] = useState({ email: "", password: "" })
    const [formErrors, setFormErrors] = useState({ email: false, password: false })

    const onFormFieldChange = (e) => {
        const { name, value } = e.target //name=e.target.name ; value=e.target.value
        testFieldValue(name, value) 
        const _user = { ...user }
        _user[name] = value //value de email et password 
        setUser(_user)
    }

    const testFieldValue = (name, value) => {
        switch (name) {
            case "email":
                if (!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) { // si mail invalide
                    if (!formErrors.email) {
                        setFormErrors({ ...formErrors, email: true }) //erreur mail signalé
                    }
                }
                else if (formErrors.email) { // si mail ok (erreur = false)
                    setFormErrors({ ...formErrors, email: false })
                }
                break;
            case "password":
                if (!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
                    if (!formErrors.password) {
                        setFormErrors({ ...formErrors, password: true })
                    }

                }
                else if (formErrors.password) {
                    setFormErrors({ ...formErrors, password: false })
                }
                break; 
                default : console.log("une erreur est survenue")
        }
    }
//-------------------------------------------------------LOGIN-------------------------------------------------
    const onLogin = (e) => {
        e.preventDefault();
        const email = user.email;
        const password = user.password;
        const mailError = formErrors.email;
        const passwordError = formErrors.password;
        !mailError && !passwordError ?
            goLogin(email, password) 
            :
            alert("Mail et/ou mot de passe sont mal remplis")
    }
    const goLogin = (email, password) => {
        const newLogin = {
            email: email,
            password: password,
        }
        const headers = new Headers()
        headers.append("content-type", "application/json")
        const reqInit = {
            method: "post",
            body: JSON.stringify(newLogin),
            headers: headers
        }
        fetch("http://localhost:3001/api/users/login", reqInit)
            .then(function (res) {
                if (res.status === 401) {
                    alert("Mot de passe ou utilisateur incorrect")
                }
                return res.json()
            }).then(function (result) {
            if (result.token){
                let userStorage = { "userId": result.userId, "token": result.token, "isAdmin": result.isAdmin }
                localStorage.setItem("Groupomania", JSON.stringify(userStorage))
                navigation("/home")}
            })
    }
//-------------------------------------------------------SIGNIN-------------------------------------------------
    const onSignin = (e) => {
        e.preventDefault();
        const email = user.email;
        const password = user.password;
        const mailError = formErrors.email;
        const passwordError = formErrors.password;
        !mailError && !passwordError  ?
            goSignin(email, password) :
            alert("Mail et/ou mot de passe sont mal remplis")
    }
    function goSignin(email, password) {
        const newUser = {
            email: email,
            password: password,
        }
        const headers = new Headers()
        headers.append("content-type", "application/json")
        const reqInit = {
            method: "post",
            body: JSON.stringify(newUser),
            headers: headers
        }
        fetch("http://localhost:3001/api/users/", reqInit)
            .then(function (res) {
                return (
                    res.json(),
                    res.status === 201 ?
                        alert("Utilisateur crée")
                        :
                        alert("Erreur: l'utilisateur ne peut pas être crée")
                )
            })
    }

    return (
        <form className="form_login">
            <div className="textarea_container">
                <input id="email" className="textarea_login" value={user.email} onChange={onFormFieldChange} name="email" placeholder="Mail" />
                {(formErrors.email && user.email.length > 0) && <p>Mail mal formaté</p>}
                <input id="password" type="password" className="textarea_login" value={user.password} onChange={onFormFieldChange} name="password" placeholder="Mot de passe" />
                {(formErrors.password && user.password.length > 0) && <p>Mot de passe mal formaté</p>}
            </div>
            <div className="submit_container">
                <input className="button" onClick={(e) => onLogin(e)} type="submit" id="login" name="login" value="Me connecter" />
                <input className="button" onClick={(e) => onSignin(e)} type="submit" id="signin" name="signin" value="Créer mon compte" />
            </div>
        </form>

    )
}

export default Loginform



