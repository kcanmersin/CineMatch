import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
      );
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('jwtAccess');
        localStorage.removeItem('jwtRefresh');
        localStorage.removeItem('isAuthenticated'); // Remove isAuthenticated from localStorage
        setIsAuthenticated(false);
        navigate('/signin');
    };

    
    
    useEffect(() => {
        const accessToken = localStorage.getItem('jwtAccess');
        const refreshToken = localStorage.getItem('jwtRefresh');
      
        const verifyToken = async (token) => {
          try {
            const response = await fetch('http://127.0.0.1:8000/auth/jwt/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });
            return response.ok;
          } catch (error) {
            console.error('Token validation failed:', error);
            return false;
          }
        };
      
        const refreshTokenRequest = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/auth/jwt/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('jwtAccess', data.access);
              setIsAuthenticated(true);
              localStorage.setItem('isAuthenticated', 'true');
            } else {
              logout();
            }
          } catch (error) {
            console.error('Refresh token failed:', error);
            logout();
          }
        };
      
        const checkAuthState = async () => {
          if (accessToken) {
            const isValid = await verifyToken(accessToken);
            if (isValid) {
              setIsAuthenticated(true);
              localStorage.setItem('isAuthenticated', 'true');
            } else if (refreshToken) {
              await refreshTokenRequest();
            } else {
              logout();
            }
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
          }
        };
      
        checkAuthState();
      }, []);  

    return (
        <AuthContext.Provider value={{ setIsAuthenticated, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
