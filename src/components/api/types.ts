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