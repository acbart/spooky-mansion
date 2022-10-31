import { Game } from "../maps/game";

export type ProcessCommand = (s: string) => void;

export function gameLogic(
    game: Game,
    setGame: (game: Game) => void,
    print: (payload: string) => void
): ProcessCommand {
    return function processCommand(fullInput: string) {
        const [command, ...args] = fullInput.split(" ");
        switch (command) {
            case "cd":
                setGame({ ...game, location: args[0] });
                break;
            case "set":
                setGame({ ...game, username: args[0] });
                print("You are now: " + args.join(" "));
                break;
        }
    };
}
