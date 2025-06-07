import React, { useCallback, useEffect, useRef } from 'react';
import { TournamentRoundTreeNodeDTO } from '../../components/api/types';
import { Button, Card } from 'react-bootstrap';

interface TournamentBracketRoundDisplayProps {
    round: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
};

interface TournamentBracketRoundCardProps {
    round: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.Ref<HTMLDivElement | null>;
};

interface TournamentBracketRoundLinesProps {
    topRoundRef: React.RefObject<HTMLDivElement | null>;
    bottomRoundRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
};

interface Position {
    x: number;
    y: number;
};

const TournamentBracketRoundCard: React.FC<TournamentBracketRoundCardProps> = ({ round, nextRound, ref }) => {
    const isSelectableRound = nextRound && round.album && !Boolean(nextRound.album);

    return (
        <Card ref={ref} className='tournament-bracket-round-card'>
            <Card.Header>{round.album ? `${round.album.artistName} - ${round.album.name}` : 'TBD'}</Card.Header>
            <Card.Img variant='top' src={round.album?.imageUrl ?? 'https://placehold.co/400'} />
            <Card.Body>
            <Button disabled={!isSelectableRound} variant='secondary' className='tournament-bracket-round-card-button'>
                Advance
            </Button>
            </Card.Body>
        </Card>
    );
};

const TournamentBracketRoundLines: React.FC<TournamentBracketRoundLinesProps> = ({ topRoundRef, bottomRoundRef, parentRef, bracketDisplayRef }) => {
    const [ topRoundPos, setTopRoundPos ] = React.useState<Position>();
    const [ bottomRoundPos, setBottomRoundPos ] = React.useState<Position>();
    const [ parentPos, setParentPos ] = React.useState<Position>();

    const setTournamentRoundLinePositions = useCallback(() => {
        if(!topRoundRef.current || !bottomRoundRef.current || !parentRef.current) {
            setTopRoundPos(undefined);
            setBottomRoundPos(undefined);
            setParentPos(undefined);

            return;
        }

        const topRoundRect = topRoundRef.current.getBoundingClientRect();
        const bottomRoundRect = bottomRoundRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        setTopRoundPos({
            x: topRoundRect.left + topRoundRect.width,
            y: topRoundRect.top + topRoundRect.height / 2
        });

        setBottomRoundPos({
            x: bottomRoundRect.left + bottomRoundRect.width,
            y: bottomRoundRect.top + bottomRoundRect.height / 2
        });

        setParentPos({
            x: parentRect.left,
            y: parentRect.top + parentRect.height / 2
        });
    }, [topRoundRef, bottomRoundRef, parentRef]);

    useEffect(() => {
        window.addEventListener('resize', setTournamentRoundLinePositions);
        window.addEventListener('scroll', setTournamentRoundLinePositions);

        setTournamentRoundLinePositions();

        if(bracketDisplayRef.current) {
            bracketDisplayRef.current.addEventListener('scroll', setTournamentRoundLinePositions);
        }

        return () => {
            window.removeEventListener('resize', setTournamentRoundLinePositions);
            window.removeEventListener('scroll', setTournamentRoundLinePositions);

            if(bracketDisplayRef.current) {
                bracketDisplayRef.current.removeEventListener('scroll', setTournamentRoundLinePositions);
            }
        };
    }, [setTournamentRoundLinePositions, bracketDisplayRef]);

    if(!topRoundPos || !bottomRoundPos || !parentPos) {
        return null;
    }

    const svgWidth = parentPos.x - topRoundPos.x;
    const svgHeight = bottomRoundPos.y - topRoundPos.y;

    return (
        <svg className='tournament-bracket-round-line' style={{ position: 'fixed', top: topRoundPos.y, left: topRoundPos.x, width: svgWidth, height: svgHeight }}>
            <line
                x1={0}
                y1={0}
                x2={svgWidth / 2}
                y2={0}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={0}
                y1={svgHeight}
                x2={svgWidth / 2}
                y2={svgHeight}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={svgWidth / 2}
                y1={0}
                x2={svgWidth / 2}
                y2={svgHeight}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={svgWidth / 2}
                y1={svgHeight / 2}
                x2={svgWidth}
                y2={svgHeight / 2}
                stroke='black'
                strokeWidth='2'
            />
        </svg>
    );
};

const TournamentBracketRoundDisplay: React.FC<TournamentBracketRoundDisplayProps> = ({ round, nextRound, ref, bracketDisplayRef }) => {
    if(round.previousRounds.length === 0) {
        return <TournamentBracketRoundCard ref={ref} round={round} nextRound={nextRound} />;
    }
    else if(round.previousRounds.length !== 2) {
        return <div className='tournament-bracket-round-container'>Invalid round structure</div>;
    }

    const parentRef = ref ?? useRef<HTMLDivElement>(null);

    const topRoundRef = useRef<HTMLDivElement>(null);
    const bottomRoundRef = useRef<HTMLDivElement>(null);

    const [ topRound, bottomRound ] = round.previousRounds;

    return (
        <div className='tournament-bracket-round-container'>
            <div className='tournament-bracket-sub-round-container'>
                <TournamentBracketRoundDisplay
                    round={topRound}
                    nextRound={round}
                    ref={topRoundRef}
                    bracketDisplayRef={bracketDisplayRef}
                />
                <TournamentBracketRoundDisplay
                    round={bottomRound}
                    nextRound={round}
                    ref={bottomRoundRef}
                    bracketDisplayRef={bracketDisplayRef}
                />
            </div>
            <div className='tournament-bracket-sub-round-container'>
                <TournamentBracketRoundCard ref={parentRef} round={round} />
            </div>
            <TournamentBracketRoundLines
                topRoundRef={topRoundRef}
                bottomRoundRef={bottomRoundRef}
                parentRef={parentRef}
                bracketDisplayRef={bracketDisplayRef}
            />
        </div>
    );
};

export default TournamentBracketRoundDisplay;