import React from "react";
import { MainArea } from "./components/MainArea";
import "./App.css";

function App(): JSX.Element {
    return (
        <div>
            <audio id="musicplayer" loop>
                <source
                    src={process.env.PUBLIC_URL + "/music/hauntedcastle.mp3"}
                />
            </audio>
            <MainArea></MainArea>
        </div>
    );
}

export default App;
