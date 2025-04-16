import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            fetchUserData(token);
        }
    }, [token]);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`, // 👈 Asegúrate de que esto se envíe
                },
            });
    
            setUser(response.data.user);
        } catch (error) {
            console.error("Error obteniendo datos del usuario:", error);
            localStorage.removeItem("token");
            setUser(null);
        }
    };
    

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
