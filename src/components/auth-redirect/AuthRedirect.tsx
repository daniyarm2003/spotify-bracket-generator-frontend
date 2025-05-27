import React from 'react';
import { useSpotifyAuth } from '../../providers/SpotifyAuthProvider';
import { Navigate } from 'react-router';

const AuthRedirect: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isLoading, isAuthenticated } = useSpotifyAuth();

    if(!isLoading && !isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return (
        <>{children}</>
    );
};

export default AuthRedirect;