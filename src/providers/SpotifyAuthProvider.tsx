import React, { useContext, createContext, useState, useEffect } from 'react';
import { User } from '../api/types';
import { useServerApi } from './ServerApiProvider';
import SpotifyAuthApi from '../api/SpotifyAuthApi';
import { isAbortError } from '../utils/misc';

export interface SpotifyAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    error: any;
    updateAuthContext: (abortController?: AbortController) => Promise<void>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType>({} as SpotifyAuthContextType);

export const useSpotifyAuth = () => {
    return useContext(SpotifyAuthContext);
};

const SpotifyAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<any>(null);

    const serverApi = useServerApi();
    const spotifyAuthApi = new SpotifyAuthApi(serverApi);

    const updateAuthContext = async (abortController?: AbortController) => {
        setIsLoading(true);
        setError(null);
        setUser(null);

        try {
            const authenticatedUser = await spotifyAuthApi.getAuthenticatedUser(abortController);

            setUser(authenticatedUser);
            setIsAuthenticated(true);
            setIsLoading(false);

        } catch (err: any) {
            if(isAbortError(err)) {
                console.warn('Request aborted');
            }
            else if(err?.status === 401) {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
            else {
                console.error('Error fetching user:', err);
                
                setIsLoading(false);
                setError(err);
                setIsAuthenticated(false);
            }
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        updateAuthContext(abortController);

        return () => {
            abortController.abort();
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider value={{ isAuthenticated, isLoading, user, error, updateAuthContext }}>
            {children}
        </SpotifyAuthContext.Provider>
    );
}

export default SpotifyAuthProvider;