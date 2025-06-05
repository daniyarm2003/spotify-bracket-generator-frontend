import React from 'react';
import { TournamentWithBracketDTO } from '../../components/api/types';
import { Container, Spinner } from 'react-bootstrap';

interface TournamentBracketDisplayProps {
    tournament?: TournamentWithBracketDTO;
};

const TournamentBracketDisplay: React.FC<TournamentBracketDisplayProps> = ({ tournament }) => {
    if(!tournament) {
        return <Spinner animation='border' />;
    }

    return (
        <Container className='tournament-bracket-display'>
            <p>{tournament.bracket.id}</p>
        </Container>
    );
};

export default TournamentBracketDisplay;