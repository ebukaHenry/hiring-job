import { createContext, useState } from "react";
import {jwtDecode} from "jwt-decode"

export const AuthContext=createContext(null);

export function AuthProvider({children}) {
    const [authState, setAuthState] = useState(()=>{
        const token=localStorage.getItem("token");
        if(token){
            try {
                const user=jwtDecode(token);
                return {user, token};
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem("token");
            }
        }
        return {user:null, token:null}
    });

    const login= (token)=>{
        try {
            const user=jwtDecode(token);
            localStorage.setItem("token", token);
            setAuthState({user, token});
        } catch (error) {
            console.error("Invalid token during login:", error);
            logout();
        }
    }

    const logout =()=>{
        localStorage.removeItem("token");
        setAuthState({user:null, token:null});
    }

    return(
        <AuthContext.Provider value={{user:authState.user, token:authState.token, login, logout,}}>
            {children}
        </AuthContext.Provider>
    );
    
}