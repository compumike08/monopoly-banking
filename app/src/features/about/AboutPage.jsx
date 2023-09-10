import React from "react";
import { Container, Row, Col } from "reactstrap";

const AboutPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>About Monopoly Banking</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>References</h4>
          <ul>
            <li>Monopoly [Board game]. Hasbro.</li>
            <li>
              <a
                href="https://www.softicons.com/game-icons/brain-games-icons-by-quizanswers/monopoly-icon"
                title="Monopoly Icon"
              >
                Monopoly Icon
              </a>{" "}
              - Copyright 2013{" "}
              <a href="https://www.softicons.com/designers/quizanswers">
                QuizAnswers
              </a>
              , Licensed under{" "}
              <a href="https://creativecommons.org/licenses/by/2.5/">
                CC Attribution 2.5 Generic
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
