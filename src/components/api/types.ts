export interface User {
    id: string;
    spotifyId: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    savedAlbums: SpotifyAlbum[];
}

export interface SpotifyAlbum {
    id: string;
    spotifyId: string;
    name: string;
    artistName: string;
    imageUrl?: string;
    savingUsers: User[];
}

export interface TournamentSimpleDTO {
    id: string;
    name: string;
    published: boolean;
    createdAt: Date;
    userId: string;
}

export interface TournamentWithBracketDTO {
    id: string;
    name: string;
    published: boolean;
    createdAt: Date;
    bracket: TournamentRoundTreeNodeDTO;
}

export interface TournamentRoundTreeNodeDTO {
    id: number;
    nextRoundId?: number;
    tournamentId: string;
    album?: SpotifyAlbum;
    previousRounds: TournamentRoundTreeNodeDTO[];
}

export interface TournamentCreateNewProps {
    name: string;
    albumCount: number;
}

export interface TournamentEditProps {
    name?: string;
}