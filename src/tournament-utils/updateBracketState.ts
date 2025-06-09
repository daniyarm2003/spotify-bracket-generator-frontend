import { TournamentRoundTreeNodeDTO } from '../api/types';

export function updateBracketStateAfterWin(bracket: TournamentRoundTreeNodeDTO, nextRound: TournamentRoundTreeNodeDTO): TournamentRoundTreeNodeDTO {
    if(bracket.id === nextRound.id) {
        return { ...nextRound };
    }

    return {
        ...bracket,
        previousRounds: bracket.previousRounds.map(previousRound => updateBracketStateAfterWin(previousRound, nextRound))
    };
}