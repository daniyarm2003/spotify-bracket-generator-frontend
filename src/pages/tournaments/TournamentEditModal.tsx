import { Button, Form, Modal } from 'react-bootstrap';
import { TournamentSimpleDTO } from '../../components/api/types';
import { useState, useEffect } from 'react';

export interface TournamentCreateNewProps {
    name: string;
    albumCount: number;
}

interface TournamentEditModalProps {
    tournament?: TournamentSimpleDTO;
    maxTournamentRounds: number;
    show: boolean;
    onClose: () => void;
    onCreateNew: (props: TournamentCreateNewProps) => Promise<void>;
};

const TournamentEditModal: React.FC<TournamentEditModalProps> = ({ tournament, show, onClose, maxTournamentRounds, onCreateNew }) => {
    const [ tournamentName, setTournamentName ] = useState('');
    const [ numRounds, setNumRounds ] = useState(16);

    useEffect(() => {
        if(tournament) {
            setTournamentName(tournament.name);
        } 
        else {
            setTournamentName('');
            setNumRounds(16);
        }
    }, [show]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentName(e.target.value);
    };

    const handleNumRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);

        if(isNaN(value) || !isFinite(value)) {
            setNumRounds(16);
        }
        else if(value < 1 || value > maxTournamentRounds) {
            setNumRounds(Math.min(Math.max(value, 1), maxTournamentRounds));
        }
        else {
            setNumRounds(value);
        }
    };

    const handleSubmit = () => {
        if(!tournament) {
            onCreateNew({
                name: tournamentName,
                albumCount: numRounds
            });
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered contentClassName='tournament-edit-modal'>
            <Modal.Header className='tournament-edit-modal-header' closeButton>
                <Modal.Title>{tournament ? `Edit ${tournament.name}` : 'Create Tournament'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Tournament Name</Form.Label>
                        <Form.Control type='text' maxLength={32} value={tournamentName} onChange={handleNameChange} />
                    </Form.Group>
                    {
                        !tournament && (
                            <>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Number of Rounds</Form.Label>
                                    <Form.Control 
                                        type='number' 
                                        value={numRounds} 
                                        onChange={handleNumRoundsChange}
                                        min={1}
                                        max={maxTournamentRounds}
                                    />
                                </Form.Group>
                            </>
                        )
                    }
                    <Button variant='secondary' className='tournament-card-edit-button w-100' onClick={() => handleSubmit()}>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TournamentEditModal;