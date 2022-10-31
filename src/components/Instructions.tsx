import React from "react";

const INSTRUCTIONS: string[][] = [
    ["cd", "location", "Move to new room"],
    ["ls", "Look around this room"],
    ["less", "something", "Look at something"],
    ["su", "username", "Change your name"],
    ["history", "View previously run commands"],
    ["hint", "Ask for a hint"],
    ["clear", "Clear the console"],
    ["reset", "Reset the game"]
];

export function Instructions(): JSX.Element {
    return (
        <div className="instructions" style={{ overflowY: "auto" }}>
            You can use the following commands: <br />
            <br />
            {INSTRUCTIONS.map(([command, ...args]: string[], index) => {
                return (
                    <pre key={index}>
                        <code>{command}</code> {args.slice(0, -1).join(" ")}
                        <br />
                        <small>{args[args.length - 1]}</small>
                    </pre>
                );
            })}
        </div>
    );
}
