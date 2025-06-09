import React from 'react';
import { TournamentSimpleDTO } from '../../api/types';
import { Button, Card, Stack } from 'react-bootstrap';

interface TournamentCardProps {
    tournament: TournamentSimpleDTO;
    onEditTournament: (tournament: TournamentSimpleDTO) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onEditTournament }: TournamentCardProps) => {
    return (
        <Card className='tournament-card'>
            <Card.Body>
                <Card.Title className='tournament-card-title-text'>{tournament.name}</Card.Title>
                <Card.Subtitle className='tournament-card-subtitle-text'>Created at {tournament.createdAt.toLocaleDateString()}</Card.Subtitle>
                <Stack direction='vertical' className='tournament-card-button-stack'>
                    <Button variant='secondary' className='tournament-card-button' href={`/tournaments/${tournament.id}`}>View</Button>
                    <Button variant='secondary' className='tournament-card-button' onClick={() => onEditTournament(tournament)}>Edit Details</Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}

export default TournamentCard;