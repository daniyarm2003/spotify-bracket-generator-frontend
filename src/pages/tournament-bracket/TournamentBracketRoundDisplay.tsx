import React, { useCallback, useEffect, useRef } from 'react';
import { TournamentRoundTreeNodeDTO } from '../../api/types';
import { Button, Card } from 'react-bootstrap';

type TournamentBracketOrientation = 'LEFT' | 'CENTER' | 'RIGHT';

interface TournamentBracketRoundDisplayProps {
    orientation?: TournamentBracketOrientation;
    round: TournamentRoundTreeNodeDTO;
    siblingRound?: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
    advanceTournamentWinner: (nextRoundId: number, winnerId: number) => Promise<void>;
};

interface TournamentBracketRoundCardProps {
    round: TournamentRoundTreeNodeDTO;
    siblingRound?: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.Ref<HTMLDivElement | null>;
    advanceTournamentWinner: () => Promise<void>;
};

interface TournamentBracketRoundLinesProps {
    orientation?: TournamentBracketOrientation;
    topRoundRef: React.RefObject<HTMLDivElement | null>;
    bottomRoundRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
};

interface Position {
    x: number;
    y: number;
};

const TournamentBracketRoundCard: React.FC<TournamentBracketRoundCardProps> = ({ round, siblingRound, nextRound, ref, advanceTournamentWinner }) => {
    const isSelectableRound = nextRound && siblingRound?.album && round.album && !Boolean(nextRound.album);

    const handleAdvanceClick = () => {
        if(isSelectableRound) {
            advanceTournamentWinner();
        }
    }

    return (
        <Card ref={ref} className='tournament-bracket-round-card'>
            <Card.Header>{round.album ? `${round.album.artistName} - ${round.album.name}` : 'TBD'}</Card.Header>
            <Card.Img variant='top' src={round.album?.imageUrl ?? 'https://placehold.co/400'} />
            <Card.Body>
            <Button disabled={!isSelectableRound} onClick={handleAdvanceClick} variant='secondary' className='tournament-bracket-round-card-button'>
                Advance
            </Button>
            </Card.Body>
        </Card>
    );
};

const TournamentBracketRoundLines: React.FC<TournamentBracketRoundLinesProps> = ({ orientation, topRoundRef, bottomRoundRef, parentRef, bracketDisplayRef }) => {
    const [ topRoundPos, setTopRoundPos ] = React.useState<Position>();
    const [ bottomRoundPos, setBottomRoundPos ] = React.useState<Position>();

    const [ parentPos, setParentPos ] = React.useState<Position>();
    const [ parentRightPos, setParentRightPos ] = React.useState<Position>();

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
            x: orientation === 'LEFT' ? topRoundRect.left : topRoundRect.left + topRoundRect.width,
            y: topRoundRect.top + topRoundRect.height / 2
        });

        setBottomRoundPos({
            x: orientation === 'RIGHT' ? bottomRoundRect.left + bottomRoundRect.width : bottomRoundRect.left,
            y: bottomRoundRect.top + bottomRoundRect.height / 2
        });

        setParentPos({
            x: orientation === 'LEFT' ? parentRect.left + parentRect.width : parentRect.left,
            y: parentRect.top + parentRect.height / 2
        });

        if(orientation === 'CENTER') {
            setParentRightPos({
                x: parentRect.left + parentRect.width,
                y: parentRect.top + parentRect.height / 2
            });
        }
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
    }, [setTournamentRoundLinePositions, bracketDisplayRef, orientation]);

    if(!topRoundPos || !bottomRoundPos || !parentPos) {
        return null;
    }

    const bracketOrientation = orientation ?? 'CENTER';

    if(bracketOrientation === 'CENTER') {
        if(!parentRightPos) {
            return null;
        }

        const svgWidth1 = parentPos.x - topRoundPos.x;
        const svgWidth2 = bottomRoundPos.x - parentRightPos.x;

        const svgHeightPadding = 5;

        const svgHeight1 = Math.abs(topRoundPos.y - parentPos.y) + 2 * svgHeightPadding;
        const svgHeight2 = Math.abs(bottomRoundPos.y - parentPos.y) + 2 * svgHeightPadding;

        const svgTop1 = Math.min(topRoundPos.y, parentPos.y) - svgHeightPadding;
        const svgTop2 = Math.min(bottomRoundPos.y, parentPos.y) - svgHeightPadding;

        return (
            <>
                <svg className='tournament-bracket-round-line' style={{ position: 'fixed', top: svgTop1, left: topRoundPos.x, width: svgWidth1, height: svgHeight1 }}>
                    <line
                        x1={0}
                        y1={topRoundPos.y - svgTop1}
                        x2={svgWidth1}
                        y2={parentPos.y - svgTop1}
                        stroke='black'
                        strokeWidth='2'
                    />
                </svg>
                <svg className='tournament-bracket-round-line' style={{ position: 'fixed', top: svgTop2, left: parentRightPos.x, width: svgWidth2, height: svgHeight2 }}>
                    <line
                        x1={0}
                        y1={parentPos.y - svgTop2}
                        x2={svgWidth2}
                        y2={bottomRoundPos.y - svgTop2}
                        stroke='black'
                        strokeWidth='2'
                    />
                </svg>
            </>
        );
    }

    const svgWidth = bracketOrientation === 'RIGHT' ? parentPos.x - topRoundPos.x : topRoundPos.x - parentPos.x;
    const svgHeight = bottomRoundPos.y - topRoundPos.y;

    return (
        <svg className='tournament-bracket-round-line' style={{ 
            position: 'fixed', 
            top: topRoundPos.y, left: orientation === 'RIGHT' ? topRoundPos.x : parentPos.x, 
            width: svgWidth, 
            height: svgHeight 
        }}>
            <line
                x1={orientation === 'RIGHT' ? 0 : svgWidth}
                y1={0}
                x2={svgWidth / 2}
                y2={0}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={orientation === 'RIGHT' ? 0 : svgWidth}
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
                x2={orientation === 'RIGHT' ? svgWidth : 0}
                y2={svgHeight / 2}
                stroke='black'
                strokeWidth='2'
            />
        </svg>
    );
};

const TournamentBracketRoundDisplay: React.FC<TournamentBracketRoundDisplayProps> = ({ orientation, round, siblingRound, nextRound, ref, bracketDisplayRef, advanceTournamentWinner }) => {
    if(round.previousRounds.length === 0) {
        return <TournamentBracketRoundCard 
            advanceTournamentWinner={() => advanceTournamentWinner(nextRound!.id, round.id)} 
            ref={ref} 
            round={round} 
            siblingRound={siblingRound}
            nextRound={nextRound} 
        />;
    }
    else if(round.previousRounds.length !== 2) {
        return <div className='tournament-bracket-round-container'>Invalid round structure</div>;
    }

    const bracketOrientation = orientation ?? 'CENTER';

    const parentRef = ref ?? useRef<HTMLDivElement>(null);

    const topRoundRef = useRef<HTMLDivElement>(null);
    const bottomRoundRef = useRef<HTMLDivElement>(null);

    const [ topRound, bottomRound ] = round.previousRounds;

    if(bracketOrientation === 'CENTER') {
        return (
            <div className='tournament-bracket-round-container'>
                <div className='tournament-bracket-sub-round-container'>
                    <TournamentBracketRoundDisplay
                        orientation='RIGHT'
                        round={topRound}
                        siblingRound={bottomRound}
                        nextRound={round}
                        ref={topRoundRef}
                        bracketDisplayRef={bracketDisplayRef}
                        advanceTournamentWinner={advanceTournamentWinner}
                    />
                </div>
                <div className='tournament-bracket-sub-round-container'>
                    <TournamentBracketRoundCard
                        ref={parentRef} 
                        round={round} 
                        siblingRound={siblingRound}
                        nextRound={nextRound} 
                        advanceTournamentWinner={() => advanceTournamentWinner(nextRound!.id, round.id)}
                    />
                </div>
                <div className='tournament-bracket-sub-round-container'>
                    <TournamentBracketRoundDisplay
                        orientation='LEFT'
                        round={bottomRound}
                        siblingRound={topRound}
                        nextRound={round}
                        ref={bottomRoundRef}
                        bracketDisplayRef={bracketDisplayRef}
                        advanceTournamentWinner={advanceTournamentWinner}
                    />
                </div>
                <TournamentBracketRoundLines
                    orientation={bracketOrientation}
                    topRoundRef={topRoundRef}
                    bottomRoundRef={bottomRoundRef}
                    parentRef={parentRef}
                    bracketDisplayRef={bracketDisplayRef}
                />
            </div>
        );
    }

    const currentRoundElement = (
        <div className='tournament-bracket-sub-round-container'>
            <TournamentBracketRoundCard 
                ref={parentRef} 
                round={round} 
                siblingRound={siblingRound}
                nextRound={nextRound} 
                advanceTournamentWinner={() => advanceTournamentWinner(nextRound!.id, round.id)}
            />
        </div>
    );

    const previousRoundsElement = (
        <div className='tournament-bracket-sub-round-container'>
            <TournamentBracketRoundDisplay
                orientation={bracketOrientation}
                round={topRound}
                siblingRound={bottomRound}
                nextRound={round}
                ref={topRoundRef}
                bracketDisplayRef={bracketDisplayRef}
                advanceTournamentWinner={advanceTournamentWinner}
            />
            <TournamentBracketRoundDisplay
                orientation={bracketOrientation}
                round={bottomRound}
                siblingRound={topRound}
                nextRound={round}
                ref={bottomRoundRef}
                bracketDisplayRef={bracketDisplayRef}
                advanceTournamentWinner={advanceTournamentWinner}
            />
        </div>
    );

    return (
        <div className='tournament-bracket-round-container'>
            {bracketOrientation === 'RIGHT' ? (
                <>
                    {previousRoundsElement}
                    {currentRoundElement}
                </>
            ) : (
                <>
                    {currentRoundElement}
                    {previousRoundsElement}
                </>
            )}
            <TournamentBracketRoundLines
                orientation={bracketOrientation}
                topRoundRef={topRoundRef}
                bottomRoundRef={bottomRoundRef}
                parentRef={parentRef}
                bracketDisplayRef={bracketDisplayRef}
            />
        </div>
    );
};

export default TournamentBracketRoundDisplay;