import React, { useCallback, useEffect } from "react";
import { Terminal, useEventQueue, textLine, textWord } from "crt-terminal";
import { Game } from "../maps/game";
import { gameLogic } from "./game_logic";

const bannerText = "Welcome...";

export const MainTerminal = ({
    game,
    setGame,
    corrupted
}: {
    game: Game;
    setGame: (game: Game) => void;
    corrupted: boolean;
}) => {
    const eventQueue = useEventQueue();
    const { print, clear } = eventQueue.handlers;

    const printLines = useCallback(
        (text: string | string[]) => {
            let lines;
            if (typeof text === "string") {
                lines = [text];
            } else {
                lines = text;
            }
            print(
                lines.map((text: string) =>
                    textLine({
                        words: [textWord({ characters: text })]
                    })
                )
            );
        },
        [print]
    );

    const processCommand = useCallback(
        gameLogic(game, setGame, printLines, clear),
        [game, setGame, printLines, clear]
    );

    useEffect(() => {
        if (corrupted) {
            printLines([
                "Your previous game save was corrupted, unfortunately.",
                "Please report this error to Dr. Bart"
            ]);
        }
    }, [corrupted]);

    return (
        <Terminal
            prompt={`${game.username}@${game.location}> `}
            queue={eventQueue}
            banner={[
                textLine({
                    words: [
                        textWord({
                            characters: game.history.length
                                ? "Welcome back..."
                                : bannerText
                        })
                    ]
                })
            ]}
            onCommand={processCommand}
            // style={{ width: "100%" }}
        />
    );
};
