import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { authDataContext } from "../context/AuthContext";
import { useEffect } from "react";
import ConnectionButton from "./ConnectionButton";
import { userDataContext } from "../context/UserContext";


function RightSidebar() {
    let {handleGetProfile} = useContext(userDataContext);
    let {serverUrl} = useContext(authDataContext);
    let [suggestedUsers,setSuggestedUsers] = useState([]);

    const handleSuggestedUsers = async () =>{
        try{
            let result = await axios.get(`${serverUrl}/api/user/suggestedUsers`,{withCredentials:true});
            setSuggestedUsers(result.data);
        }catch(err){
            console.log(err);
        }
    }
  
    useEffect(()=>{
        handleSuggestedUsers();
    },[])

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-5 pb-3">
          <h3 className="font-semibold text-gray-800 text-[17px]">
            People you may know
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            People you might want to connect with
          </p>
        </div>

        {/* Suggested Users */}
        <div className="px-5 pb-4">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-none"
            >
              {/* Profile Image */}
              <img
                onClick={()=>handleGetProfile(user.username)}
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {user.firstName} {user.lastName}
                </h4>

                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>

                {/* Skills */}
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {user.skills.join(" • ")}
                </p>
              </div>

              {/* Connect Button */}
                <ConnectionButton userId={user._id}/>
            </div>
          ))}
        </div>

        {/* Show More */}
        <div className="border-t border-gray-200 px-5 py-3">
          <button
            className="w-full text-sm font-medium text-blue-600
                       hover:text-blue-700 transition"
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
