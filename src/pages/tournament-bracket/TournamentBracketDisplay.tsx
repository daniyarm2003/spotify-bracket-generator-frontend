import React, { useRef } from 'react';
import { TournamentWithBracketDTO } from '../../components/api/types';
import { Container, Spinner } from 'react-bootstrap';
import TournamentBracketRoundDisplay from './TournamentBracketRoundDisplay';

interface TournamentBracketDisplayProps {
    tournament?: TournamentWithBracketDTO;
};

const TournamentBracketDisplay: React.FC<TournamentBracketDisplayProps> = ({ tournament }) => {
    const bracketDisplayRef = useRef<HTMLDivElement | null>(null);

    if(!tournament) {
        return <Spinner animation='border' />;
    }

    return (
        <Container ref={bracketDisplayRef} fluid className='tournament-bracket-display'>
            <TournamentBracketRoundDisplay
                round={tournament.bracket}
                bracketDisplayRef={bracketDisplayRef}
            />
        </Container>
    );
};

export default TournamentBracketDisplay;