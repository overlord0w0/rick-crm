import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../api';

export const ProtectedRoute = () => {
    const user = getCurrentUser();


    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};