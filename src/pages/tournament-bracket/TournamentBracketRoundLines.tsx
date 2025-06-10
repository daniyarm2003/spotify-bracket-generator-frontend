import { useCallback, useEffect } from 'react';
import { TournamentBracketOrientation } from './types';
import React from 'react';
import { Position } from '../../utils/commonTypes';

interface TournamentBracketRoundLinesProps {
    orientation?: TournamentBracketOrientation;
    topRoundRef: React.RefObject<HTMLDivElement | null>;
    bottomRoundRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    bracketDisplayRef: React.RefObject<HTMLDivElement | null>;
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

    const xLimit1 = bracketOrientation === 'RIGHT' ? Math.min(topRoundPos.x, bottomRoundPos.x) : Math.max(topRoundPos.x, bottomRoundPos.x);
    const xLimit2 = bracketOrientation === 'RIGHT' ? Math.max(topRoundPos.x, bottomRoundPos.x) : Math.min(topRoundPos.x, bottomRoundPos.x);

    const midpointX = (xLimit2 + parentPos.x) / 2;

    const svgWidth = bracketOrientation === 'RIGHT' ? parentPos.x - xLimit1 : xLimit1 - parentPos.x;
    const svgHeight = bottomRoundPos.y - topRoundPos.y;

    return (
        <svg className='tournament-bracket-round-line' style={{ 
            position: 'fixed', 
            top: topRoundPos.y, 
            left: orientation === 'RIGHT' ? xLimit1 : parentPos.x, 
            width: svgWidth, 
            height: svgHeight 
        }}>
            <line
                x1={orientation === 'RIGHT' ? topRoundPos.x - xLimit1 : topRoundPos.x - parentPos.x}
                y1={0}
                x2={orientation === 'RIGHT' ? midpointX - xLimit1 : midpointX - parentPos.x}
                y2={0}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={orientation === 'RIGHT' ? bottomRoundPos.x - xLimit1 : bottomRoundPos.x - parentPos.x}
                y1={svgHeight}
                x2={orientation === 'RIGHT' ? midpointX - xLimit1 : midpointX - parentPos.x}
                y2={svgHeight}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={orientation === 'RIGHT' ? midpointX - xLimit1 : midpointX - parentPos.x}
                y1={0}
                x2={orientation === 'RIGHT' ? midpointX - xLimit1 : midpointX - parentPos.x}
                y2={svgHeight}
                stroke='black'
                strokeWidth='2'
            />
            <line
                x1={orientation === 'RIGHT' ? midpointX - xLimit1 : midpointX - parentPos.x}
                y1={svgHeight / 2}
                x2={orientation === 'RIGHT' ? svgWidth : 0}
                y2={svgHeight / 2}
                stroke='black'
                strokeWidth='2'
            />
        </svg>
    );
};

export default TournamentBracketRoundLines;