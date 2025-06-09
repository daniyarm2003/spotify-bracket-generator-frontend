import React, { useEffect, useState } from 'react';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { Navigate, useParams } from 'react-router';
import { useServerApi } from '../../providers/ServerApiProvider';
import TournamentApi from '../../api/TournamentApi';
import { TournamentWithBracketDTO } from '../../api/types';
import { isAbortError } from '../../utils/misc';
import TournamentBracketDisplay from './TournamentBracketDisplay';

import './TournamentBracketPage.css';
import { updateBracketStateAfterWin } from '../../tournament-utils/updateBracketState';

const TournamentBracketPage: React.FC = () => {
    const { tournamentId } = useParams();

    const serverApi = useServerApi();
    const tournamentApi = new TournamentApi(serverApi);

    const [ tournament, setTournament ] = useState<TournamentWithBracketDTO>();
    const [ isTournamentLoading, setTournamentLoading ] = useState(true);
    const [ tournamentError, setTournamentError ] = useState<any>();

    const fetchTournamentBracket = async (abortController: AbortController) => {
        setTournamentLoading(true);

        if(!tournamentId) {
            return;
        }

        try {
            const tournament = await tournamentApi.getTournamentWithBracket(tournamentId, abortController);

            setTournament(tournament);
            setTournamentError(undefined);
            setTournamentLoading(false);
        }
        catch(err: any) {
            if(!isAbortError(err)) {
                setTournamentLoading(false);
                setTournamentError(err);

                console.error(err);
            }
        }
    };

    const advanceTournamentWinner = async (nextRoundId: number, winnerId: number) => {
        if(!tournament) {
            console.error('Cannot advance tournament winner: no tournament data available');
            return;
        }

        try {
            const updatedNextRound = await tournamentApi.setTournamentRoundWinner(nextRoundId, winnerId);

            setTournament(prevTournament => {
                if(!prevTournament) {
                    return undefined;
                }

                const updatedBracket = updateBracketStateAfterWin(prevTournament.bracket, updatedNextRound);

                return {
                    ...prevTournament,
                    bracket: updatedBracket
                };
            });
        }
        catch(err: any) {
            console.error('Failed to advance tournament winner:', err);
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        fetchTournamentBracket(abortController);

        return () => {
            abortController.abort();
        };
    }, []);

    if(!isTournamentLoading && tournamentError && !isAbortError(tournamentError)) {
        return <Navigate to='/tournaments' replace />;
    }

    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
            <div className='default-page-content-container'>
                <h2 className='page-heading'>{tournament?.name ?? 'Loading...'}</h2>
                <TournamentBracketDisplay tournament={tournament} advanceTournamentWinner={advanceTournamentWinner} />
            </div>
        </div>
    );
};

export default TournamentBracketPage;