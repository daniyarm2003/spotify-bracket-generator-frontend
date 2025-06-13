import { Card, Container, Spinner } from 'react-bootstrap';
import { TournamentSimpleDTO } from '../../api/types';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
    isLoading: boolean;
    tournaments: TournamentSimpleDTO[];
    onCreateNew: () => void;
    onEditTournament: (tournament: TournamentSimpleDTO) => void;
    onDeleteTournament: (tournament: TournamentSimpleDTO) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments, isLoading, onCreateNew, onEditTournament, onDeleteTournament }) => {
    if(isLoading) {
        return <Spinner animation='border' />;
    }

    return (
        <Container fluid className='tournament-list'>
            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} onEditTournament={onEditTournament} onDeleteTournament={onDeleteTournament} />
            ))}
            <Card className='tournament-card' onClick={onCreateNew}>
                <Card.Body>
                    <Card.Title className='tournament-card-title-text'>Create New</Card.Title>
                    <Card.Subtitle className='tournament-card-subtitle-text'>Click here to create a new tournament</Card.Subtitle>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TournamentList;