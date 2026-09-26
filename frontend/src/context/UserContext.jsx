import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
export const userDataContext = createContext();

function UserContext({children}){
    const navigate = useNavigate();
    let [userData,setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
    let [edit,setEdit] = useState(false);
    let [postData , setPostData] = useState([]);
    let [profileData,setProfileData] = useState([]);

    const handleGetProfile = async(username)=>{
        try{
            let result = await axios.get(`${serverUrl}/api/user/profile/${username}`,{withCredentials:true});
            setProfileData(result.data);
            navigate("/profile");
        }catch(err){
            console.log(err);
        }
    }

    const getCurrentUser = async () =>{
        try{
            let result = await axios.get(`${serverUrl}/api/user/currentUser`,{withCredentials:true});
            setUserData(result.data);
        }catch(err){
            console.log(err);
            setUserData(null);
        }
    }  

    const getPost = async () =>{
        try{
            let result = await axios.get(`${serverUrl}/api/post/getPost`,{withCredentials:true});
            setPostData(result.data);
            console.log(result.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getCurrentUser();
        getPost();
    },[]);

    const value = {userData,setUserData,edit,setEdit,postData,setPostData,getPost,profileData,setProfileData,handleGetProfile};
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext;