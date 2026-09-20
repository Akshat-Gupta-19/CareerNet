import React, { createContext } from 'react'
export const authDataContext = createContext();
export default function AuthContext({children}) {
    const serverUrl = "http://localhost:8000"
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
