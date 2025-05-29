import { Axios } from 'axios';
import { TournamentSimpleDTO } from './types';
import { TournamentCreateNewProps } from '../../pages/tournaments/TournamentEditModal';

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

    public async createTournament(props: TournamentCreateNewProps) {
        const response = await this.serverApi.post('/tournaments', props, {
            withCredentials: true
        });

        const tournament = response.data as any;

        return {
            ...tournament,
            createdAt: new Date(tournament.createdAt)
        } as TournamentSimpleDTO;
    }
}