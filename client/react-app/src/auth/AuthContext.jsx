import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO : add loader to this page also
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Track loading status
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem('jwtAccess');
            const refreshToken = localStorage.getItem('jwtRefresh');
            if (accessToken) {
                const isValid = await verifyToken(accessToken);
                if (!isValid && refreshToken) {
                    await refreshTokenRequest(refreshToken);
                } else {
                    setIsAuthenticated(isValid);
                }
            } else if (refreshToken) {
                await refreshTokenRequest(refreshToken);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}auth/jwt/verify/` , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            return response.ok;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    };

    const refreshTokenRequest = async (refreshToken) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}auth/jwt/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwtAccess', data.access);
                setIsAuthenticated(true);
            } else {
                console.error('Unable to refresh token:', await response.text());
                logout(); // Force logout if the refresh token is invalid/expired
            }
        } catch (error) {
            console.error('Refresh token failed:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtAccess');
        localStorage.removeItem('jwtRefresh');
        setIsAuthenticated(false);
        navigate('/signin');
    };

    if (loading) {
        return <div>Loading...</div>; // Render loading indicator while checking auth state
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


