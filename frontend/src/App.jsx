import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import {userDataContext} from './context/UserContext.jsx';

function App() {
  let {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/login' element={userData ? <Navigate to="/" /> : <Login />} />
      <Route path='/signup' element={userData ? <Navigate to="/" /> : <Signup />} />
    </Routes>
  )
}

export default App
