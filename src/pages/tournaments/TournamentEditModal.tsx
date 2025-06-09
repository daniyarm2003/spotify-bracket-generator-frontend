import { Button, Form, Modal } from 'react-bootstrap';
import { TournamentCreateNewProps, TournamentEditProps, TournamentSimpleDTO } from '../../api/types';
import React, { useState, useEffect } from 'react';

interface TournamentEditModalProps {
    tournament?: TournamentSimpleDTO;
    maxTournamentRounds: number;
    show: boolean;
    onClose: () => void;
    onCreateNew: (props: TournamentCreateNewProps) => Promise<void>;
    onEdit: (id: string, props: TournamentEditProps) => Promise<void>;
};

const TournamentEditModal: React.FC<TournamentEditModalProps> = ({ tournament, show, onClose, maxTournamentRounds, onCreateNew, onEdit }) => {
    const [ tournamentName, setTournamentName ] = useState('');
    const [ numRounds, setNumRounds ] = useState(16);

    const maxTournamentNameLength = 32;
    const trimmedTournamentName = tournamentName.trim();

    const isTournamentNameValid = trimmedTournamentName.length > 0 && trimmedTournamentName.length <= maxTournamentNameLength;
    const isNumRoundsValid = numRounds >= 1 && numRounds <= maxTournamentRounds;

    const formValidated = isTournamentNameValid && (tournament !== undefined || isNumRoundsValid);

    useEffect(() => {
        if(show) {
            if(tournament) {
                setTournamentName(tournament.name);
            } 
            else {
                setTournamentName('');
                setNumRounds(16);
            }
        }
    }, [show]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentName(e.target.value);
    };

    const handleNumRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);

        if(isNaN(value) || !isFinite(value) || value < 1) {
            setNumRounds(0);
        }
        else if(value > maxTournamentRounds) {
            setNumRounds(Math.min(Math.max(value, 1), maxTournamentRounds));
        }
        else {
            setNumRounds(value);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!formValidated) {
            e.stopPropagation();
            return;
        }

        if(!tournament) {
            onCreateNew({
                name: trimmedTournamentName,
                albumCount: numRounds
            });
        }
        else {
            onEdit(tournament.id, {
                name: trimmedTournamentName
            });
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered contentClassName='tournament-edit-modal'>
            <Modal.Header className='tournament-edit-modal-header' closeButton>
                <Modal.Title>{tournament ? `Edit ${tournament.name}` : 'Create Tournament'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={formValidated} onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Tournament Name</Form.Label>
                        <Form.Control
                            type='text'
                            maxLength={maxTournamentNameLength}
                            value={tournamentName}
                            onChange={handleNameChange}
                            isInvalid={!isTournamentNameValid}
                        />
                        <Form.Control.Feedback type='invalid'>
                            Tournament name must be between 1 and {maxTournamentNameLength} characters.
                        </Form.Control.Feedback>
                    </Form.Group>
                    {
                        !tournament && (
                            <>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Number of Rounds</Form.Label>
                                    <Form.Control
                                        type='number'
                                        value={numRounds || ''}
                                        onChange={handleNumRoundsChange}
                                        min={1}
                                        max={maxTournamentRounds}
                                        isInvalid={!isNumRoundsValid}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        Number of rounds must be a number between 1 and {maxTournamentRounds}.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )
                    }
                    <Button variant='secondary' className='tournament-card-edit-button w-100' type='submit'>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TournamentEditModal;