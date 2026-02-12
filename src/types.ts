export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: { name: string; url: string };
    location: { name: string; url: string };
    image: string;
    episode: string[];
    url: string;
    created: string;
}

export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: string[];
    url: string;
    created: string;
}

export interface Note {
    characterId: number;
    characterName: string;
    text: string;
    userId: string;
    createdAt: string;
}

export interface ApiResponse {
    info?: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    };
    results: Character[];
}

export interface User {
    _id: string;
    username: string;
    avatar: string;
    createdAt: string;
}