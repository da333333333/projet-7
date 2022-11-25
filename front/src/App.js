
import React  from 'react';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"
import {BrowserRouter, Routes, Route } from "react-router-dom"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/home" exact element={<Home/>}/>
        <Route path="*" element={<NotFound/>}/> 
      </Routes>
    </BrowserRouter> 
  );
}

export default App;