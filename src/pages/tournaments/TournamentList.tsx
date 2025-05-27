import { Container, Spinner } from 'react-bootstrap';
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
        <Container className='tournament-list'>
            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </Container>
    );
};

export default TournamentList;