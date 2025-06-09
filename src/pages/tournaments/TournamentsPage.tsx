import React, { useState, useEffect } from 'react';
import TitleContainer from '../../components/title-container/TitleContainer';
import MainNavbar from '../../components/main-navbar/MainNavbar';
import { useServerApi } from '../../providers/ServerApiProvider';
import TournamentApi from '../../api/TournamentApi';
import { TournamentCreateNewProps, TournamentEditProps, TournamentSimpleDTO } from '../../api/types';
import TournamentList from './TournamentList';

import './TournamentsPage.css';
import { isAbortError } from '../../utils/misc';
import TournamentEditModal from './TournamentEditModal';
import SpotifyAlbumApi from '../../api/SpotifyAlbumApi';

const TournamentsPage: React.FC = () => {
    const serverApi = useServerApi();

    const tournamentApi = new TournamentApi(serverApi);
    const spotifyAlbumApi = new SpotifyAlbumApi(serverApi);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ tournaments, setTournaments ] = useState<TournamentSimpleDTO[]>([]);

    const [ showCreateModal, setShowCreateModal ] = useState(false);
    const [ editingTournament, setEditingTournament ] = useState<TournamentSimpleDTO>();

    const [ maxTournamentRounds, setMaxTournamentRounds ] = useState(16);

    const fetchTournaments = async (abortController: AbortController) => {
        setIsLoading(true);

        try {
            const tournaments = await tournamentApi.getTournaments(abortController);
            const albumCount = await spotifyAlbumApi.getLoggedInUserSavedAlbumCount(abortController);

            setTournaments(tournaments);
            setMaxTournamentRounds(albumCount);

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

    const handleCreateNewClick = () => {
        setEditingTournament(undefined);
        setShowCreateModal(true);
    };

    const handleEditTournament = (tournament: TournamentSimpleDTO) => {
        setEditingTournament(tournament);
        setShowCreateModal(true);
    };

    const handleEditModalClose = () => {
        setShowCreateModal(false);
    };

    const onCreateNewTournament = async (props: TournamentCreateNewProps) => {
        try {
            const newTournament = await tournamentApi.createTournament(props);

            setTournaments(prevTournaments => [...prevTournaments, newTournament]);
            setShowCreateModal(false);
        } 
        catch (err: any) {
            console.error('Error creating tournament:', err);
        }
    };

    const onEditTournament = async (id: string, props: TournamentEditProps) => {
        try {
            const updatedTournament = await tournamentApi.updateTournament(id, props);

            setTournaments(prevTournaments => 
                prevTournaments.map(tournament => 
                    tournament.id === updatedTournament.id ? updatedTournament : tournament
                )
            );
            setShowCreateModal(false);
        } 
        catch (err: any) {
            console.error('Error updating tournament:', err);
        }
    }

    return (
        <div className='page-component'>
            <TitleContainer />
            <MainNavbar />
            <div className='default-page-content-container'>
                <h2 className='page-heading'>My Tournaments</h2>
                <TournamentList isLoading={isLoading} tournaments={tournaments} onCreateNew={handleCreateNewClick} onEditTournament={handleEditTournament} />
            </div>
            <TournamentEditModal
                tournament={editingTournament}
                show={showCreateModal}
                onClose={handleEditModalClose}
                maxTournamentRounds={maxTournamentRounds}
                onCreateNew={onCreateNewTournament}
                onEdit={onEditTournament}
            />
        </div>
    );
}

export default TournamentsPage;