import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { MainTerminal } from "./Terminal";
import { Instructions } from "./Instructions";
import { Game, INITIAL_GAME, MYSTERY_ROOM, Room } from "../maps/game";
import { houseMap } from "./game_logic";

export const MainArea = () => {
    const [game, setGame] = useState<Game>(INITIAL_GAME);

    const here: Room =
        game.location in houseMap ? houseMap[game.location] : MYSTERY_ROOM;
    const location = game.location in houseMap ? game.location : "backrooms";

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
                        {here.description.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
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
