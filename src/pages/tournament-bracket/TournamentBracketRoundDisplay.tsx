import React, { useRef } from 'react';
import { TournamentRoundTreeNodeDTO } from '../../components/api/types';
import { Button, Card } from 'react-bootstrap';

interface TournamentBracketRoundDisplayProps {
    round: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
};

interface TournamentBracketRoundCardProps {
    round: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
};

const TournamentBracketRoundCard: React.FC<TournamentBracketRoundCardProps> = ({ round, nextRound }) => {
    const isSelectableRound = nextRound && round.album && !Boolean(nextRound.album);

    return (
        <Card className='tournament-bracket-round-card'>
            <Card.Header>{round.album ? `${round.album.artistName} - ${round.album.name}` : 'TBD'}</Card.Header>
            <Card.Img variant='top' src={round.album?.imageUrl ?? 'https://placehold.co/400'} />
            <Card.Body>
            <Button disabled={!isSelectableRound} variant='secondary' className='tournament-bracket-round-card-button'>
                Advance
            </Button>
            </Card.Body>
        </Card>
    );
};

const TournamentBracketRoundDisplay: React.FC<TournamentBracketRoundDisplayProps> = ({ round, nextRound }) => {
    if(round.previousRounds.length === 0) {
        return <TournamentBracketRoundCard round={round} nextRound={nextRound} />;
    }

    return (
        <div className='tournament-bracket-round-container'>
            <div className='tournament-bracket-sub-round-container'>
                {
                    round.previousRounds.map(previousRound => (
                        <TournamentBracketRoundDisplay
                            key={previousRound.id}
                            round={previousRound}
                            nextRound={round}
                        />
                    ))
                }
            </div>
            <div className='tournament-bracket-sub-round-container'>
                <TournamentBracketRoundCard round={round} />
            </div>
        </div>
    );
};

export default TournamentBracketRoundDisplay;