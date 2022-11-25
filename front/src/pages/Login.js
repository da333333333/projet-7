import React  from 'react';
import Logo from "../components/Logo"
import "../styles/login.css"
import Loginform from "../components/Login_form";
const Login=()=> {
    return (
        <div className="login"> 
            <Logo/>
            <Loginform/> 
        </div>     
    )

}

export default Login;