import { Axios } from 'axios';
import { TournamentSimpleDTO } from './types';

export default class TournamentApi {
    private readonly serverApi: Axios;

    public constructor(serverApi: Axios) {
        this.serverApi = serverApi;
    }

    public async getTournaments(abortController?: AbortController) {
        const response = await this.serverApi.get('/tournaments', {
            signal: abortController?.signal,
            withCredentials: true
        });

        const tournaments = response.data as any[];

        const formattedTournaments: TournamentSimpleDTO[] = tournaments.map(tournament => ({
            ...tournament,
            createdAt: new Date(tournament.createdAt)
        }));

        return formattedTournaments;
    }
}