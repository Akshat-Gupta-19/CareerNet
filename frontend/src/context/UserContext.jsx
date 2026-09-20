import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';
export const userDataContext = createContext();

function UserContext({children}){
    let [userData,setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);

    const getCurrentUser = async () =>{
        try{
            let result = await axios.get(`${serverUrl}/api/user/currentUser`,{withCredentials:true});
            setUserData(result.data);
        }catch(err){
            console.log(err);
            setUserData(null);
        }
    }  

    useEffect(()=>{
        getCurrentUser()
    },[]);

    const value = {userData,setUserData};
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext;