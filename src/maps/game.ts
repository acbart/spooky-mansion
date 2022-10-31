export interface Game {
    username: string;
    location: string;
}

export const INITIAL_GAME = {
    username: "user",
    location: "outside"
};

export interface Room {
    name: string;
    description: string;
    links: string[];
}
