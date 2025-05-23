import { Axios } from 'axios';
import { User } from './types';

export default class SpotifyAuthApi {
    private readonly serverApi: Axios;

    public constructor(serverApi: Axios) {
        this.serverApi = serverApi;
    }

    public async getAuthenticatedUser(abortController?: AbortController) {
        const response = await this.serverApi.get('/auth/me', {
            signal: abortController?.signal,
            withCredentials: true
        });

        return response.data as User;
    }

    public async logout(abortController?: AbortController) {
        const response = await this.serverApi.post('/auth/logout', {}, {
            signal: abortController?.signal,
            withCredentials: true
        });

        return response.data;
    }
}