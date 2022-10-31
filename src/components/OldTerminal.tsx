/*
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { initTerminal } from "ttty";

export const Terminal = () => {
    const [username, setUsername] = useState("user");

    useEffect(() => {
        initTerminal({
            host: document.querySelector("#terminal") as HTMLElement,
            prompt: "user@spooky:~$ ",
            commands: {
                echo: {
                    name: "echo",
                    description: "a test command with one echo arg",
                    argDescriptions: ["a string to be echoed in console"],
                    func: ({ print }, argument) => {
                        print(argument);
                        setUsername(argument);
                    }
                },
                test: {
                    name: "test",
                    description: "a test command with no args",
                    func: ({ print }) => {
                        print("foo" + username);
                        setUsername("Banana");
                    }
                }
            }
        });
    }, []);
    return (
        <div className="App">
            <Container>
                <Row>
                    <Col
                        xs={9}
                        style={{
                            background: "midnightblue",
                            color: "white",
                            minWidth: "384px",
                            minHeight: "384px"
                        }}
                    >
                        Scene
                    </Col>
                    <Col style={{ background: "rgb(74,74,74)" }}>
                        Description
                    </Col>
                </Row>
                <Row>
                    <Col xs={9}>
                        <div
                            id="terminal"
                            style={{
                                width: "100%",
                                height: "calc(100vh - 384px)"
                            }}
                        />
                    </Col>
                    <Col
                        style={{ color: "white", background: "rgb(74,74,74)" }}
                    >
                        Inventory: {username}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

*/
export const unused = {};
