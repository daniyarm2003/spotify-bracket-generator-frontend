import React, { useRef } from 'react';
import { TournamentRoundTreeNodeDTO } from '../../api/types';
import { TournamentBracketOrientation } from './types';
import TournamentBracketRoundCard from './TournamentBracketRoundCard';
import TournamentBracketRoundLines from './TournamentBracketRoundLines';

interface TournamentBracketRoundDisplayProps {
    orientation?: TournamentBracketOrientation;
    round: TournamentRoundTreeNodeDTO;
    siblingRound?: TournamentRoundTreeNodeDTO;
    nextRound?: TournamentRoundTreeNodeDTO;
    ref?: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
    advanceTournamentWinner: (nextRoundId: number, winnerId?: number) => Promise<void>;
};

const TournamentBracketRoundDisplay: React.FC<TournamentBracketRoundDisplayProps> = ({ orientation, round, siblingRound, nextRound, ref, bracketDisplayRef, advanceTournamentWinner }) => {
    if(round.previousRounds.length === 0) {
        return <TournamentBracketRoundCard 
            advanceTournamentWinner={() => advanceTournamentWinner(nextRound!.id, round.id)}
            removeTournamentWinner={() => advanceTournamentWinner(round.id, undefined)}
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
                        removeTournamentWinner={() => advanceTournamentWinner(round.id, undefined)}
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
                removeTournamentWinner={() => advanceTournamentWinner(round.id, undefined)}
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