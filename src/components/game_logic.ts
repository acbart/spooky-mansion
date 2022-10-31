import { Game, Room } from "../maps/game";
import houseMapRaw from "../maps/house.json";

export const houseMap = houseMapRaw as Record<string, Room>;

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

export const commandCd = ({
    command,
    args,
    game,
    setGame,
    print
}: CommandParams): Game | null => {
    const newLocation = args[0];
    if (newLocation in houseMap) {
        return {
            ...game,
            location: newLocation
        };
    }
    return null;
};

export const commandLs = ({
    command,
    args,
    game,
    print
}: CommandParams): Game | null => {
    const where = args.join(" ").trim().toLowerCase();
    const here = houseMap[game.location];
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
            "Possible exits include:",
            ...here.links.map((room) => " " + room)
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
    const here = houseMap[game.location];
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

export const commandHint = ({ game, print, args }: CommandParams): null => {
    const here = houseMap[game.location];
    print(here.hint);
    return null;
};

export const commandLogin = ({
    command,
    args,
    game,
    setGame,
    print
}: CommandParams): Game => {
    print("You are now: " + args.join(" "));
    return { ...game, username: args[0] };
};

export const commandEcho = ({
    command,
    args,
    game,
    setGame,
    print
}: CommandParams): null => {
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

export const commandMan = ({ game, print }: CommandParams): null => {
    print([
        "What is a man, but a miserable pile of secrets?",
        "But enough talk. Get back to the game!"
    ]);
    return null;
};

export const deniedCommand = ({
    game,
    print,
    command
}: CommandParams): null => {
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
    helpme: commandHint
};

export function gameLogic(
    game: Game,
    setGame: (game: Game) => void,
    print: (payload: string | string[]) => void,
    clear: () => void
): ProcessCommand {
    return function processCommand(fullInput: string) {
        const [command, ...args] = fullInput.split(" ");
        if (command in commandMap) {
            const commandFunction = commandMap[command];
            const nextState = commandFunction({
                game,
                setGame,
                print,
                clear,
                command,
                args
            });
            if (nextState !== null) {
                nextState.history = [...nextState.history, fullInput];
                console.log(nextState);
                setGame(nextState);
            } else {
                setGame({ ...game, history: [...game.history, fullInput] });
            }
        } else {
            print("I do not understand that command.");
            setGame({ ...game, history: [...game.history, fullInput] });
        }
    };
}
