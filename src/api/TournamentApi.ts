import { Axios } from 'axios';
import { TournamentCreateNewProps, TournamentEditProps, TournamentRoundTreeNodeDTO, TournamentSimpleDTO, TournamentWithBracketDTO } from './types';

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

    public async updateTournament(id: string, props: TournamentEditProps) {
        const response = await this.serverApi.patch(`/tournaments/${id}`, props, {
            withCredentials: true
        });

        const tournament = response.data as any;

        return {
            ...tournament,
            createdAt: new Date(tournament.createdAt)
        } as TournamentSimpleDTO;
    }

    public async getTournamentWithBracket(id: string, abortController?: AbortController) {
        const response = await this.serverApi.get(`/tournaments/${id}`, {
            signal: abortController?.signal,
            withCredentials: true
        });

        const tournament = response.data as any;

        const formattedTournament: TournamentWithBracketDTO = {
            ...tournament,
            createdAt: new Date(tournament.createdAt)
        };

        return formattedTournament;
    }

    public async deleteTournament(id: string) {
        const response = await this.serverApi.delete(`/tournaments/${id}`, {
            withCredentials: true
        });

        const tournament = response.data as any;

        const formattedTournament: TournamentWithBracketDTO = {
            ...tournament,
            createdAt: new Date(tournament.createdAt)
        };

        return formattedTournament;
    }

    public async setTournamentRoundWinner(nextRoundId: number, winnerId: number) {
        const response = await this.serverApi.put(`/tournaments/rounds/${nextRoundId}`, {
            winnerId
        }, {
            withCredentials: true
        });

        return response.data as TournamentRoundTreeNodeDTO;
    }

    public async removeTournamentWinner(roundId: number) {
        const response = await this.serverApi.put(`/tournaments/rounds/${roundId}`, {
            winnerId: null
        }, {
            withCredentials: true
        });

        return response.data as TournamentRoundTreeNodeDTO;
    }
}