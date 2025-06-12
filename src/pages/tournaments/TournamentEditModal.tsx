import { Button, Form, Modal, Spinner } from 'react-bootstrap';
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
    const [ requestLoading, setRequestLoading ] = useState(false);

    const [ tournamentName, setTournamentName ] = useState('');
    const [ numRounds, setNumRounds ] = useState(16);

    const [ useAI, setUseAI ] = useState(false);
    const [ aiPrompt, setAiPrompt ] = useState('');

    const maxTournamentNameLength = 32;
    const maxPromptLength = 256;

    const trimmedTournamentName = tournamentName.trim();

    const maxRounds = useAI ? Math.min(maxTournamentRounds, 32) : maxTournamentRounds;

    const isTournamentNameValid = trimmedTournamentName.length > 0 && trimmedTournamentName.length <= maxTournamentNameLength;
    const isNumRoundsValid = numRounds >= 1 && numRounds <= maxRounds;

    const isAiPromptValid = !useAI || (aiPrompt.trim().length > 0 && aiPrompt.trim().length <= maxPromptLength);

    const formValidated = isTournamentNameValid && (tournament !== undefined || (isNumRoundsValid && isAiPromptValid));

    useEffect(() => {
        if(show) {
            if(tournament) {
                setTournamentName(tournament.name);
            } 
            else {
                setTournamentName('');
                setNumRounds(16);

                setUseAI(false);
                setAiPrompt('');
            }

            setRequestLoading(false);
        }
    }, [show]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentName(e.target.value);
    };

    const handleUseAIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseAI(e.target.checked);
    }

    const handleAIPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAiPrompt(e.target.value);
    };

    const handleNumRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);

        if(isNaN(value) || !isFinite(value) || value < 1) {
            setNumRounds(0);
        }
        else if(value > maxRounds) {
            setNumRounds(Math.min(Math.max(value, 1), maxRounds));
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

        setRequestLoading(true);

        if(!tournament) {
            const creationProps: TournamentCreateNewProps = {
                name: trimmedTournamentName,
                albumCount: numRounds
            };

            if(useAI) {
                creationProps.aiPrompt = aiPrompt.trim();
            }

            onCreateNew(creationProps).then(() => setRequestLoading(false));
        }
        else {
            onEdit(tournament.id, {
                name: trimmedTournamentName
            }).then(() => setRequestLoading(false));
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
                                        max={maxRounds}
                                        isInvalid={!isNumRoundsValid}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        Number of rounds must be a number between 1 and {maxRounds}.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Check
                                        type='checkbox'
                                        checked={useAI}
                                        label='Use AI to select albums'
                                        onChange={handleUseAIChange}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>AI Prompt</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        disabled={!useAI}
                                        value={aiPrompt}
                                        onChange={handleAIPromptChange}
                                        isInvalid={!isAiPromptValid}
                                        maxLength={maxPromptLength}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        AI prompt must be between 1 and {maxPromptLength} characters.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )
                    }
                    <Button disabled={requestLoading} variant='secondary' className='tournament-card-edit-button w-100' type='submit'>
                        {
                            requestLoading ? (<Spinner animation='border' />) : 'Submit'
                        }
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TournamentEditModal;