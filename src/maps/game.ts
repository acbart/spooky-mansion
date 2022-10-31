export interface Game {
    username: string;
    location: string;
    history: string[];
    path: string[];
}

export const INITIAL_GAME = {
    username: "user",
    location: "outside",
    history: [],
    path: ["outside"]
};

export interface GameFile {
    name: string;
    contents: string | string[];
}

export const MYSTERY_ROOM = {
    name: "Unknown Room????",
    description: [
        "You have found yourself in the Back Rooms.",
        "You should get out of here.",
        "Reset your game, please."
    ],
    hint: ["Seriously, use the reset command and fix your game."],
    links: ["outside"],
    files: [
        {
            name: "message",
            contents: [
                "You see a message scrawled on the wall.",
                'It says, "GET OUT".',
                "Probably a good idea."
            ]
        }
    ]
};

export interface Room {
    name: string;
    description: string[];
    hint: string[];
    links: string[];
    files: GameFile[];
}
