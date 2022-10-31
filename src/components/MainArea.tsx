import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
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

    const here: Room = getHere(game);
    const location = here.id;

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
