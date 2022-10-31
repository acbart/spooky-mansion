import {
    Game,
    INITIAL_GAME,
    MYSTERY_ROOM,
    Room,
    SAVE_GAME_KEY
} from "../maps/game";
import houseMapRaw from "../maps/house.json";

export const houseMap = Object.fromEntries(
    Object.entries(houseMapRaw).map(
        ([id, room]: [string, Partial<Room> | string]) => [
            id,
            typeof room === "string" ? room : { ...room, id }
        ]
    )
) as Record<string, Room | string>;

function randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export type ProcessCommand = (s: string) => void;

export interface CommandParams {
    command: string;
    args: string[];
    game: Game;
    setGame: (game: Game) => void;
    print: (payload: string | string[]) => void;
    clear: () => void;
}

export function getHere(game: Game): Room {
    if (game.location in houseMap) {
        let next: string | Room = game.location;
        while (next !== undefined) {
            next = houseMap[next];
            if (typeof next !== "string") {
                return next;
            }
        }
        return MYSTERY_ROOM;
    } else {
        return MYSTERY_ROOM;
    }
}

export const getHiddenRooms = (game: Game): string[] => {
    const here = getHere(game);
    return game.secrets
        .filter((possible: string) => possible in here.secretLinks)
        .map((room: string) => here.secretLinks[room]);
};

export const commandCd = ({
    args,
    game,
    print
}: CommandParams): Game | null => {
    const newLocation = args[0].trim().toLowerCase();
    const here = getHere(game);
    if (newLocation === "..") {
        return {
            ...game,
            location: here.links[0]
        };
    } else if (newLocation === ".") {
        return null;
    } else if (newLocation === game.location || newLocation === here.id) {
        print([`You are already in the ${newLocation}.`]);
    } else if (here.links.includes(newLocation)) {
        return {
            ...game,
            location: newLocation
        };
    } else {
        const secret = game.secrets.find(
            (secret: string) => secret in here.secretLinks
        );
        if (secret !== undefined) {
            return {
                ...game,
                location: here.secretLinks[secret]
            };
        } else {
            print(`You do not see where the ${newLocation} is.`);
        }
    }
    return null;
};

export const commandLs = ({
    args,
    game,
    print
}: CommandParams): Game | null => {
    const where = args.join(" ").trim().toLowerCase();
    const here = getHere(game);
    if (here.links.includes(where)) {
        print([
            `You try to peer into the darkness towards the ${where}, but you cannot see anything.`,
            "You can really only see what is immediately around you."
        ]);
    } else if (here.files.map((item) => item.name).includes(where)) {
        print([
            `The ${where} is not a location you can look at. It's a thing. Try a different command?`
        ]);
    } else if (!where) {
        print([
            "You look around and see:",
            ...here.files.map((item) => " " + item.name),
            "Possible locations to go to:",
            ...here.links.map((room) => " " + room),
            ...getHiddenRooms(game).map((room) => " " + room)
        ]);
    } else {
        print([
            `You wish to look around in ${where}?`,
            "I do not know where that is, I'm afraid."
        ]);
    }
    return null;
};

export const commandRead = ({ game, print, args }: CommandParams): null => {
    const what = args.join(" ").trim().toLowerCase();
    const here = getHere(game);
    if (here.links.includes(what)) {
        print([
            `The ${what} is a location. You cannot do that.`,
            "Perhaps you want to move there instead with cd?"
        ]);
    } else {
        const item = here.files.find((item) => item.name === what);
        if (item) {
            print(item.contents);
        } else {
            print(`You do not see any ${what} here.`);
        }
    }
    return null;
};

export const commandCat = ({
    game,
    print,
    args
}: CommandParams): Game | null => {
    const what = args.join(" ").trim().toLowerCase();
    const here = getHere(game);
    if (here.id === "library") {
        if (what.includes("book")) {
            print([
                "You show the book to the cat, who lazily opens one eye.",
                "Yawning and stretching, it slowly rousts.",
                "It peers curiously at the book for a minute, and then stares back at you.",
                "After what seems like forever, the cat blinks approvingly.",
                "Then, it stares at the wall behind you and meows loudly.",
                "Turning, you are surprised to see that a new door has appeared.",
                "The door appears to lead to a hallway."
            ]);
            return {
                ...game,
                secrets: [...game.secrets, "catted"]
            };
        } else if (!what) {
            print(["What do you want to ask the cat?"]);
        } else {
            print([
                "The cat didn't seem to respond to that question.",
                "Maybe try something else?"
            ]);
        }
    } else {
        print(["Cat? I don't see any cats here. Maybe somewhere else?"]);
    }
    return null;
};

export const commandBloodBitByte = (params: CommandParams): null => {
    const here = getHere(params.game);
    if (here.id === "hallway") {
        params.print([
            `You were confident the answer was ${params.command}, but the man just frowns and shakes his head.`,
            "That doesn't appear to be what he's looking for.",
            'What does he mean, "half of a bite", anyway?'
        ]);
        return null;
    } else {
        return deniedCommand(params);
    }
};

export const commandNibble = (params: CommandParams): Game | null => {
    const here = getHere(params.game);
    if (here.id === "hallway") {
        params.print([
            "The vampire grins and nods his head.",
            "   \"You're a clever one! I'll let you through.\"",
            "He glides gracefully out of the way, leaving the path to the kitchen open."
        ]);
        return { ...params.game, secrets: [...params.game.secrets, "nibble"] };
    } else {
        return deniedCommand(params);
    }
};

export const commandRm = (params: CommandParams): Game | null => {
    const here = getHere(params.game);
    if (here.id === "kitchen") {
        params.print([
            "You can't remove zombie processes with the rm command, unfortunately.",
            "The dumb zombies just stand there, lurking. Mocking you.",
            "Stupid zombies."
        ]);
        return null;
    } else {
        return deniedCommand(params);
    }
};

export const commandKill = (params: CommandParams): Game | null => {
    const here = getHere(params.game);
    if (here.id === "kitchen") {
        params.print([
            "You use the kill command, clearing out a bunch of unnecessary zombies.",
            "The rest of the zombies give you a wide berth.",
            "They may be braindead, but I guess they're not as dumb as they look.",
            "Ahead of them, you can see a path out to the courtyard."
        ]);
        return { ...params.game, secrets: [...params.game.secrets, "zombies"] };
    } else {
        return deniedCommand(params);
    }
};

export const commandHint = ({ game, print }: CommandParams): null => {
    const here = getHere(game);
    print(here.hint);
    return null;
};

export const commandLogin = ({ args, game, print }: CommandParams): Game => {
    print("You are now: " + args.join(" "));
    return { ...game, username: args[0] };
};

export const commandEcho = ({ args, print }: CommandParams): null => {
    print(["Your words echo off the walls...", args.join(" ")]);
    return null;
};

export const commandClear = ({ clear }: CommandParams): null => {
    clear();
    return null;
};

export const commandHistory = ({ game, print }: CommandParams): null => {
    print([
        "You recall what you have already done...",
        ...game.history.map((i) => "> " + i)
    ]);
    return null;
};

export const commandMan = ({ print }: CommandParams): null => {
    print([
        "What is a man, but a miserable pile of secrets?",
        "But enough talk. Get back to the game!"
    ]);
    return null;
};

export const commandReset = ({ print }: CommandParams): Game => {
    print(["The game was reset."]);
    return INITIAL_GAME;
};

export const deniedCommand = ({ print, command }: CommandParams): null => {
    print(
        randomItem([
            `Sorry, we don't do use ${command} here.`,
            `You want to ${command}? Why would you want to do that?`,
            `Nice idea, but unfortunately ${command} doesn't work here.`,
            `I've heard of ${command}, but I won't let you do it here.`,
            `You tried to use ${command}, but found yourself powerless.`
        ])
    );
    return null;
};

const commandMap: Record<string, (c: CommandParams) => Game | null> = {
    cd: commandCd,
    ls: commandLs,
    dir: commandLs,
    less: commandRead,
    more: commandRead,
    read: commandRead,
    open: commandRead,
    su: commandLogin,
    login: commandLogin,
    echo: commandEcho,
    cls: commandClear,
    clear: commandClear,
    history: commandHistory,
    man: commandMan,
    emacs: deniedCommand,
    vim: deniedCommand,
    nano: deniedCommand,
    shutdown: deniedCommand,
    hint: commandHint,
    help: commandHint,
    helpme: commandHint,
    reset: commandReset,
    // Library Cat
    cat: commandCat,
    // Hallway Vampire
    blood: commandBloodBitByte,
    bit: commandBloodBitByte,
    byte: commandBloodBitByte,
    bite: commandBloodBitByte,
    nibble: commandNibble,
    // Kitchen Zombies
    kill: commandKill,
    pkill: commandKill,
    rm: commandRm
};

export function gameLogic(
    game: Game,
    setGame: (game: Game) => void,
    print: (payload: string | string[]) => void,
    clear: () => void
): ProcessCommand {
    return function processCommand(fullInput: string) {
        const [command, ...args] = fullInput.split(" ");
        let nextState: Game | null;
        if (command in commandMap) {
            const commandFunction = commandMap[command];
            nextState = commandFunction({
                game,
                setGame,
                print,
                clear,
                command,
                args
            });
            if (nextState !== null) {
                nextState.history = [...nextState.history, fullInput];
                setGame(nextState);
            } else {
                nextState = { ...game, history: [...game.history, fullInput] };
                setGame(nextState);
            }
        } else {
            print("I do not understand that command.");
            nextState = { ...game, history: [...game.history, fullInput] };
            setGame(nextState);
        }
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(nextState));
    };
}
