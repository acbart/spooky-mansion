import React, { useCallback } from "react";
import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import { Game } from "../maps/game";
import { gameLogic } from "./game_logic";

const bannerText = "Welcome...";

export const MainTerminal = ({
    game,
    setGame
}: {
    game: Game;
    setGame: (game: Game) => void;
}) => {
    const eventQueue = useEventQueue();
    const { print } = eventQueue.handlers;

    const printLines = useCallback(
        (text: string) => {
            print([
                textLine({
                    words: [
                        textWord({
                            characters: text
                        })
                    ]
                })
            ]);
        },
        [print]
    );

    const processCommand = useCallback(gameLogic(game, setGame, printLines), [
        game,
        setGame,
        printLines
    ]);

    return (
        <Terminal
            prompt={`${game.username}@${game.location}> `}
            queue={eventQueue}
            banner={[
                textLine({
                    words: [textWord({ characters: bannerText })]
                })
            ]}
            onCommand={processCommand}
            // style={{ width: "100%" }}
        />
    );
};
