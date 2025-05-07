import React from 'react';
import ServerApiProvider from './ServerApiProvider';
import SpotifyAuthProvider from './SpotifyAuthProvider';

const TopLevelProviderWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <ServerApiProvider>
            <SpotifyAuthProvider>
                {children}
            </SpotifyAuthProvider>
        </ServerApiProvider>
    );
}

export default TopLevelProviderWrapper;