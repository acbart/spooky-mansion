import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { MainTerminal } from "./Terminal";
import { Instructions } from "./Instructions";
import { Game, INITIAL_GAME, Room, SAVE_GAME_KEY } from "../maps/game";
import { getHere } from "./game_logic";
import ReactMarkdown from "react-markdown";
import { AltTerminal } from "./AltTerminal";

const SAVED_GAME = localStorage.getItem(SAVE_GAME_KEY);
let RELOADED_GAME: Game | null = null;
let WAS_GAME_CORRUPTED = false;
if (SAVED_GAME != null) {
    try {
        RELOADED_GAME = JSON.parse(SAVED_GAME);
    } catch (e) {
        console.error(e);
        console.log("Old game save data:", SAVED_GAME);
        RELOADED_GAME = null;
        WAS_GAME_CORRUPTED = true;
    }
}

function isMobile(): boolean {
    //if ("maxTouchPoints" in navigator) return navigator.maxTouchPoints > 0;

    const mQ = matchMedia?.("(pointer:coarse)");
    if (mQ?.media === "(pointer:coarse)") return !!mQ.matches;

    if ("orientation" in window) return true;

    return (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(navigator.userAgent) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(navigator.userAgent)
    );
}

export const MainArea = () => {
    const [game, setGame] = useState<Game>(
        RELOADED_GAME == null ? INITIAL_GAME : RELOADED_GAME
    );
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [useAltTerminal, setUseAltTerminal] = useState<boolean>(isMobile());

    const here: Room = getHere(game);
    const location = here.id;
    const inGarden = location === "garden";

    useEffect(() => {
        const musicPlayer = document.getElementById(
            "musicplayer"
        ) as HTMLAudioElement;
        const shouldPlay =
            game.secrets.includes("skeletons") && location === "crypt";
        setShowVideo(shouldPlay);
        if (shouldPlay && musicPlayer != null) {
            musicPlayer.pause();
            //setGame({ ...game, music: false });
        }
    }, [game]);

    useEffect(() => {
        const musicPlayer = document.getElementById(
            "musicplayer"
        ) as HTMLAudioElement;
        if (musicPlayer != null) {
            if (game.music) {
                musicPlayer
                    .play()
                    .catch(() => setGame({ ...game, music: false }));
            } else {
                musicPlayer.pause();
            }
        } else {
            setGame({ ...game, music: false });
        }
    }, [game.music]);

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col
                        xs={12}
                        md={9}
                        style={{
                            background: "black",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {showVideo ? (
                            <iframe
                                width="384"
                                height="384"
                                src="https://www.youtube.com/embed/n_qbGJuxCYY?autoplay=1"
                                title="Spooky Scary Skeleton Dance Remix"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <Image
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/" +
                                    location +
                                    ".png"
                                }
                                fluid={true}
                                style={{
                                    width: "100%",
                                    maxWidth: "384px",
                                    maxHeight: "384px"
                                }}
                            />
                        )}
                    </Col>
                    <Col
                        xs={12}
                        md={3}
                        style={{ background: "rgb(34,34,34)", color: "white" }}
                    >
                        <h3>{here.name}</h3>
                        {inGarden && (
                            <>
                                <a
                                    target="_blank"
                                    href={
                                        process.env.PUBLIC_URL +
                                        "/images/prize.png"
                                    }
                                    rel="noreferrer"
                                >
                                    Get QR Code
                                </a>
                            </>
                        )}
                        <ReactMarkdown>
                            {here.description.join("\n\n")}
                        </ReactMarkdown>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                setGame({ ...game, music: !game.music })
                            }
                        >
                            {game.music ? "Mute Music" : "Play Music"}
                        </Button>
                        <Button
                            className="ps-2"
                            variant="secondary"
                            size="sm"
                            onClick={() => setUseAltTerminal(!useAltTerminal)}
                        >
                            {useAltTerminal ? "Terminal" : "Alt Terminal"}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col
                        className="terminal-area"
                        xs={12}
                        md={9}
                        style={{ height: "calc(100vh - 384px)" }}
                    >
                        {useAltTerminal ? (
                            <AltTerminal
                                game={game}
                                setGame={setGame}
                                corrupted={WAS_GAME_CORRUPTED}
                            ></AltTerminal>
                        ) : (
                            <MainTerminal
                                game={game}
                                setGame={setGame}
                                corrupted={WAS_GAME_CORRUPTED}
                            ></MainTerminal>
                        )}
                    </Col>
                    <Col
                        md={3}
                        style={{ color: "white", background: "rgb(34,34,34)" }}
                    >
                        <Instructions></Instructions>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
