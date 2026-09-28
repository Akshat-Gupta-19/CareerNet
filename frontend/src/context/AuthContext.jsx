import React, { createContext } from 'react'
export const authDataContext = createContext();
export default function AuthContext({children}) {
    const serverUrl = "https://careernet-backend.onrender.com"
    let value = { 
        serverUrl
    }
    return (
        <div>
            <authDataContext.Provider value={value}>
            {children}
            </authDataContext.Provider>
        </div>
    )
}
