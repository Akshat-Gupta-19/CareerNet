import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import {userDataContext} from './context/UserContext.jsx';
import Network from './components/Network.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './components/EditProfile.jsx';
import Notification from './components/Notification.jsx';

function App() {
  let {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/login' element={userData ? <Navigate to="/" /> : <Login />} />
      <Route path='/signup' element={userData ? <Navigate to="/" /> : <Signup />} />
      <Route path='/network' element={userData ? <Network /> : <Navigate to="/login" />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
      <Route path='/notification' element={userData ? <Notification /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
