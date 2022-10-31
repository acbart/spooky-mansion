import React, { useState, useCallback, useEffect } from "react";
import AltTerminalInternal, { TerminalOutput } from "react-terminal-ui";

import { Game } from "../maps/game";
import { gameLogic } from "./game_logic";

const bannerText = "Welcome...";

const recolor = (line: string, prompt: string): JSX.Element => {
    if (line.startsWith(prompt)) {
        const rest = line.slice(prompt.length);
        return (
            <>
                <span style={{ color: "#a2a2a2" }}>{prompt}</span>
                <span style={{ color: "#eee" }}>{rest}</span>
            </>
        );
    } else {
        return <span>{line}</span>;
    }
};

export const AltTerminal = ({
    game,
    setGame,
    corrupted
}: {
    game: Game;
    setGame: (game: Game) => void;
    corrupted: boolean;
}) => {
    const message = game.history.length ? "Welcome back..." : bannerText;
    const [terminalLineData, setTerminalLineData] = useState([
        <TerminalOutput key={0}>{message}</TerminalOutput>
    ]);

    const clear = () => {
        setTerminalLineData([]);
    };
    const print = (line: string | string[]) => {
        let lines;
        if (typeof line === "string") {
            lines = [line];
        } else {
            lines = line;
        }
        setTerminalLineData([
            ...terminalLineData,
            ...lines.map((line: string, index: number) => (
                <TerminalOutput key={terminalLineData.length + index + 1}>
                    {recolor(line, prompt)}
                </TerminalOutput>
            ))
        ]);
    };

    const prompt = `${game.username}@${game.location}>`;
    const processCommand = useCallback(
        gameLogic(game, setGame, print, clear, prompt),
        [game, setGame, print, clear]
    );

    useEffect(() => {
        if (corrupted) {
            print(
                "Your previous game save was corrupted, unfortunately. Please report this error to Dr. Bart"
            );
        }
    }, [corrupted]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "10px"
            }}
        >
            <AltTerminalInternal onInput={processCommand} prompt={prompt}>
                {terminalLineData}
            </AltTerminalInternal>
        </div>
    );
};
