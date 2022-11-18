import * as React from "react";
import { useQuery } from "@apollo/client";
import { FIND_RANKING } from "../graphql-operations";
import {
  Button,
  Col,
  Container,
  ListGroup,
  Modal,
  Row,
  Spinner
} from 'react-bootstrap';
import { client } from "..";

export default function Ranking(props) {

  const { loading, data } = useQuery(FIND_RANKING);
  const ranking = data ? data.RankingSorted : null;

  const { show, setShow } = props;

  const handleClose = () => {
    client.clearStore();
    setShow(false);
  }

  function drawRanking(ranking, position) {
    return (
      <ListGroup.Item
        className="ranking"
        as="li"
        key={ranking._id}>
        <Container>
          <Row>
            <Col sm="8" className="ranking-col">
              <Row>
                <Col style={{ fontSize: "1.5rem" }}>{ranking.user.email}</Col>
              </Row>
              <Row className="ranking-stats">
                <Col>Win Rate</Col>
                <Col>Total Time</Col>
                <Col>Total Games</Col>
              </Row>
              <Row className="ranking-stats">
                <Col>{ranking.winRate == 0 ? ranking.winRate : ranking.winRate.toFixed(2)}</Col>
                <Col>{new Date(ranking.totalTime * 1000).toISOString().substr(11, 8)}</Col>
                <Col>{ranking.totalGames}</Col>
              </Row>
            </Col>
            <Col sm="4" className="d-flex align-items-center justify-content-center ranking-position numberCircle">{position + 1}</Col>
          </Row>
        </Container>
      </ListGroup.Item>
    )

  }

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trivia Ranking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ?
          (<Spinner
            className="loader"
            animation="border"
            role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>) :
          (<ListGroup
            as="ul">
            {ranking && ranking.map((user, index) => {
              return drawRanking(user, index)
            })}
          </ListGroup>)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


