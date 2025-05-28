import { Card, Container, Spinner } from 'react-bootstrap';
import { TournamentSimpleDTO } from '../../components/api/types';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
    isLoading: boolean;
    tournaments: TournamentSimpleDTO[];
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments, isLoading }) => {
    if(isLoading) {
        return <Spinner animation='border' />;
    }

    return (
        <Container fluid className='tournament-list'>
            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
            <Card className='tournament-card'>
                <Card.Body>
                    <Card.Title className='tournament-card-title-text'>Create New</Card.Title>
                    <Card.Subtitle className='tournament-card-subtitle-text'>Click here to create a new tournament</Card.Subtitle>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TournamentList;