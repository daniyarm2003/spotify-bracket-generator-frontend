import React from 'react';
import { TournamentSimpleDTO } from '../../components/api/types';
import { Card } from 'react-bootstrap';

interface TournamentCardProps {
    tournament: TournamentSimpleDTO;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }: TournamentCardProps) => {
    return (
        <Card className='tournament-card'>
            <Card.Body>
                <Card.Title className='tournament-card-title-text'>{tournament.name}</Card.Title>
                <Card.Subtitle className='tournament-card-subtitle-text'>Created at {tournament.createdAt.toLocaleDateString()}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default TournamentCard;