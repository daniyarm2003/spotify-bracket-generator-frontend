import React, { useRef } from 'react';
import { TournamentWithBracketDTO } from '../../api/types';
import { Container, Spinner } from 'react-bootstrap';
import TournamentBracketRoundDisplay from './TournamentBracketRoundDisplay';

interface TournamentBracketDisplayProps {
    tournament?: TournamentWithBracketDTO;
    advanceTournamentWinner: (nextRoundId: number, winnerId?: number) => Promise<void>;
};

const TournamentBracketDisplay: React.FC<TournamentBracketDisplayProps> = ({ tournament, advanceTournamentWinner }) => {
    const bracketDisplayRef = useRef<HTMLDivElement | null>(null);

    if(!tournament) {
        return <Spinner animation='border' />;
    }

    return (
        <Container fluid className='tournament-bracket-display-outer'>
            <Container ref={bracketDisplayRef} fluid className='tournament-bracket-display'>
                <TournamentBracketRoundDisplay
                    round={tournament.bracket}
                    bracketDisplayRef={bracketDisplayRef}
                    advanceTournamentWinner={advanceTournamentWinner}
                />
            </Container>
        </Container>
    );
};

export default TournamentBracketDisplay;