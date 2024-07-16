import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn }) => {
    return <div>{isLoggedIn ? <Outlet /> : <Navigate to='/auth/sign-in' />}</div>;
};

export default ProtectedRoute;
