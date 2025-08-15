import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");


  if (!isLoggedIn || !userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
