import axios, { Axios } from 'axios';
import React, { createContext, useContext } from 'react';

const ServerApiContext = createContext<Axios>({} as Axios);

export const useServerApi = () => {
    return useContext(ServerApiContext);
}

const serverApi = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL
});


const ServerApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <ServerApiContext.Provider value={serverApi}>
            {children}
        </ServerApiContext.Provider>
    );
}

export default ServerApiProvider;