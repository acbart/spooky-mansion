import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { MainTerminal } from "./Terminal";
import { Instructions } from "./Instructions";
import { Game, INITIAL_GAME, Room, SAVE_GAME_KEY } from "../maps/game";
import { getHere } from "./game_logic";
import ReactMarkdown from "react-markdown";

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

export const MainArea = () => {
    const [game, setGame] = useState<Game>(
        RELOADED_GAME == null ? INITIAL_GAME : RELOADED_GAME
    );
    const [showVideo, setShowVideo] = useState<boolean>(false);

    const here: Room = getHere(game);
    const location = here.id;

    useEffect(() => {
        const musicPlayer = document.getElementById(
            "musicplayer"
        ) as HTMLAudioElement;
        const shouldPlay =
            game.secrets.includes("skeletons") && location === "crypt";
        setShowVideo(shouldPlay);
        if (shouldPlay && musicPlayer != null) {
            musicPlayer.pause();
            setGame({ ...game, music: false });
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
                    </Col>
                </Row>
                <Row>
                    <Col
                        xs={12}
                        md={9}
                        style={{ height: "calc(100vh - 384px)" }}
                    >
                        <MainTerminal
                            game={game}
                            setGame={setGame}
                            corrupted={WAS_GAME_CORRUPTED}
                        ></MainTerminal>
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
