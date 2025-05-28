import React, { useState, useEffect } from 'react';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { useServerApi } from '../../providers/ServerApiProvider';
import TournamentApi from '../../components/api/TournamentApi';
import { TournamentSimpleDTO } from '../../components/api/types';
import TournamentList from './TournamentList';

import './TournamentsPage.css';
import { isAbortError } from '../../utils/misc';

const TournamentsPage: React.FC = () => {
    const serverApi = useServerApi();
    const tournamentApi = new TournamentApi(serverApi);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ tournaments, setTournaments ] = useState<TournamentSimpleDTO[]>([]);

    const fetchTournaments = async (abortController: AbortController) => {
        setIsLoading(true);

        try {
            const tournaments = await tournamentApi.getTournaments(abortController);

            setTournaments(tournaments);
            setIsLoading(false);
        }
        catch (err: any) {
            if(isAbortError(err)) {
                console.warn('Request aborted');
            }
            else {
                console.error('Error fetching tournaments:', err);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchTournaments(abortController);

        return () => {
            abortController.abort();
        }
    }, []);

    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
            <div className='default-page-content-container'>
                <h2 className='page-heading'>My Tournaments</h2>
                <TournamentList isLoading={isLoading} tournaments={tournaments} />
            </div>
        </div>
    );
}

export default TournamentsPage;