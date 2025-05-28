import { Button, Form, Modal } from 'react-bootstrap';
import { TournamentSimpleDTO } from '../../components/api/types';
import { useState, useEffect } from 'react';

interface TournamentEditModalProps {
    tournament?: TournamentSimpleDTO;
    show: boolean;
    onClose: () => void;
};

const TournamentEditModal: React.FC<TournamentEditModalProps> = ({ tournament, show, onClose }) => {
    const [ tournamentName, setTournamentName ] = useState('');
    const [ numRounds, setNumRounds ] = useState(1);

    const maxRounds = 16;

    useEffect(() => {
        if(tournament) {
            setTournamentName(tournament.name);
        } 
        else {
            setTournamentName('');
            setNumRounds(1);
        }
    }, [show]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentName(e.target.value);
    };

    const handleNumRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);

        if(isNaN(value) || !isFinite(value)) {
            setNumRounds(1);
        }
        else if(value < 1 || value > maxRounds) {
            setNumRounds(Math.min(Math.max(value, 1), maxRounds));
        }
        else {
            setNumRounds(value);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered contentClassName='tournament-edit-modal'>
            <Modal.Header className='tournament-edit-modal-header' closeButton>
                <Modal.Title>{tournament ? `Edit ${tournament.name}` : 'Create Tournament'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Tournament Name</Form.Label>
                        <Form.Control type='text' value={tournamentName} onChange={handleNameChange} />
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
                                        max={maxRounds}
                                    />
                                </Form.Group>
                            </>
                        )
                    }
                    <Button variant='secondary' className='tournament-card-edit-button w-100' onClick={onClose}>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TournamentEditModal;