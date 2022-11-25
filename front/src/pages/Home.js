import React  from 'react';
import Navigation from "../components/Navigation";
import "../styles/login.css"
import "../styles/home.css"
import Logo from "../components/Logo"
import News from "../components/News";

const Home=()=> {

    return (
        <div className="home"> 
            <Navigation/>
            <Logo/>   
            <News />          
        </div>          

    )

}

export default Home;

