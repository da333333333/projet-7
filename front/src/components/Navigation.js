import React  from 'react';
import { NavLink, useNavigate } from "react-router-dom"


    const Navigation = () => {

    const navigation = useNavigate()
        
    const logout = () =>{
        localStorage.removeItem("Groupomania")
        navigation("/")
    }

    return (
        <div className="navigation" id="navigation" >
            <NavLink onClick={()=>logout()} exact="true" className="button" id="loginNav" to="/">
                Logout 
            </NavLink>
        </div>
    )
}


export default Navigation

