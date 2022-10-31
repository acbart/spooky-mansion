import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { MainTerminal } from "./Terminal";
import houseMap from "../maps/house.json";
import { Instructions } from "./Instructions";
import { Game, INITIAL_GAME, Room } from "../maps/game";

export const MainArea = () => {
    const [game, setGame] = useState<Game>(INITIAL_GAME);

    const house = houseMap as Record<string, Room>;
    const description = house[game.location].description;

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
                                game.location +
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
                        style={{ background: "rgb(74,74,74)", color: "white" }}
                    >
                        {description}
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
                        style={{ color: "white", background: "rgb(74,74,74)" }}
                    >
                        <Instructions></Instructions>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
