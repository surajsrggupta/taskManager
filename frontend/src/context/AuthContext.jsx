import { createContext, useContext, useState } from "react";

//context creation
const AuthContext = createContext();

//create provider

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))  || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);


    // login function  
    const login = (userData, tokenData) =>{
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
    }

    //logout functon
    const logout = () =>{
        setUser(null);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

    }

    return (
        <AuthContext.Provider  value = {{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = ()=> useContext(AuthContext);