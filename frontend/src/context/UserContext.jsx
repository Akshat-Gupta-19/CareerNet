import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';
export const userDataContext = createContext();

function UserContext({children}){
    let [userData,setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
    let [edit,setEdit] = useState(false);
    let [postData , setPostData] = useState([]);

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

    const value = {userData,setUserData, edit, setEdit , postData,setPostData,getPost};
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext;