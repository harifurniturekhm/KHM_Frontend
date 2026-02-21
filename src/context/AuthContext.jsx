import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            API.get('/user-auth/verify')
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('userToken'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const googleLogin = async (credential) => {
        const res = await API.post('/user-auth/google-login', { credential });
        localStorage.setItem('userToken', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const updateProfile = async (name, phone) => {
        const res = await API.put('/user-auth/update-profile', { name, phone });
        setUser(res.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, googleLogin, updateProfile, logout, showLoginModal, setShowLoginModal, showProfileModal, setShowProfileModal }}>
            {children}
        </AuthContext.Provider>
    );
};
