import React from 'react';
import { TournamentWithBracketDTO } from '../../components/api/types';
import { Container, Spinner } from 'react-bootstrap';
import TournamentBracketRoundDisplay from './TournamentBracketRoundDisplay';

interface TournamentBracketDisplayProps {
    tournament?: TournamentWithBracketDTO;
};

const TournamentBracketDisplay: React.FC<TournamentBracketDisplayProps> = ({ tournament }) => {
    if(!tournament) {
        return <Spinner animation='border' />;
    }

    return (
        <Container fluid className='tournament-bracket-display'>
            <TournamentBracketRoundDisplay
                round={tournament.bracket}
            />
        </Container>
    );
};

export default TournamentBracketDisplay;