import { Button, Card, Stack } from 'react-bootstrap';
import { TournamentRoundTreeNodeDTO } from '../../api/types';

interface TournamentBracketRoundCardProps {
    round: TournamentRoundTreeNodeDTO;
    siblingRound?: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.Ref<HTMLDivElement | null>;
    advanceTournamentWinner: () => Promise<void>;
    removeTournamentWinner: () => Promise<void>;
};

const TournamentBracketRoundCard: React.FC<TournamentBracketRoundCardProps> = ({ round, siblingRound, nextRound, ref, advanceTournamentWinner, removeTournamentWinner }) => {
    const isSelectableRound = nextRound && siblingRound?.album && round.album;
    const isClearableRound = Boolean(round.album) && round.previousRounds.length !== 0;

    const handleAdvanceClick = () => {
        if(isSelectableRound) {
            advanceTournamentWinner();
        }
    }

    const handleClearClick = () => {
        if(isClearableRound) {
            removeTournamentWinner();
        }
    };

    return (
        <Card ref={ref} className='tournament-bracket-round-card'>
            <Card.Header>{round.album ? `${round.album.artistName} - ${round.album.name}` : 'TBD'}</Card.Header>
            <Card.Img variant='top' src={round.album?.imageUrl ?? 'https://placehold.co/400'} />
            <Card.Body>
            <Stack className='tournament-bracket-round-button-stack' direction='vertical' gap={1}>
                <Button disabled={!isSelectableRound} onClick={handleAdvanceClick} variant='secondary' className='tournament-bracket-round-card-button'>
                    Advance
                </Button>
                <Button disabled={!isClearableRound} onClick={handleClearClick} variant='secondary' className='tournament-bracket-round-card-button'>
                    Clear
                </Button>
            </Stack>
            </Card.Body>
        </Card>
    );
};

export default TournamentBracketRoundCard;