import { Navigate } from 'react-router-dom';


export default function PrivateRoute({ children, isAuthenticated }) {
  // Redirect to the sign-in page if not authenticated
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

