export const SAVE_GAME_KEY = "BART_SPOOKY_MANSION_SAVE_FILE";

export interface Game {
    username: string;
    location: string;
    history: string[];
    path: string[];
    secrets: string[];
    music: boolean;
}

export const INITIAL_GAME = {
    username: "user",
    location: "outside",
    history: [],
    path: ["outside"],
    secrets: [],
    music: true
};

export interface GameFile {
    name: string;
    contents: string | string[];
}

export const MYSTERY_ROOM = {
    id: "backrooms",
    name: "Unknown Room????",
    description: [
        "You have found yourself in the Back Rooms.",
        "You should get out of here.",
        "Try to use the following command:",
        "  cd outside",
        "If that doesn't work, you may need to reset your game."
    ],
    hint: ["Seriously, use the reset command and fix your game."],
    links: ["outside"],
    secretLinks: {},
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
    id: string;
    name: string;
    description: string[];
    hint: string[];
    links: string[];
    secretLinks: Record<string, string>;
    files: GameFile[];
}
