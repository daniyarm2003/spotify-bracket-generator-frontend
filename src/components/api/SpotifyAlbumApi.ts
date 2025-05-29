import { Axios } from 'axios';

export default class SpotifyAlbumApi {
    private readonly serverApi: Axios;

    public constructor(serverApi: Axios) {
        this.serverApi = serverApi;
    }

    public async getLoggedInUserSavedAlbumCount(abortController?: AbortController): Promise<number> {
        const response = await this.serverApi.get('/albums/count', {
            signal: abortController?.signal,
            withCredentials: true
        });

        return response.data.count;
    }
}