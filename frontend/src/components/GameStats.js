import * as React from "react";
import { app } from "../index";
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner
} from 'react-bootstrap';

export default class GameStats extends React.Component {

  constructor(props) {
    super(props);
    this.getStats();
    this.state = { loading: true, stats: {} }
    this.toggleLoading = this.toggleLoading.bind(this);
    this.addStats = this.addStats.bind(this);
  }

  handleClose = () => this.props.setShow(false);

  toggleLoading() {
    this.setState({ loading: false });
  }

  addStats(game) {
    this.setState({ stats: game })
  }

  getStats = async () => {
    try {
      const user = app.currentUser;
      if (user.id === app.currentUser.id) {
        const result = await app.currentUser.functions.getLastGameStats(user.id);
        this.addStats(result);
      } else {
        alert("No user found");
        this.handleClose()
      }
      this.toggleLoading();
    } catch (error) {
      console.error("Issue uppdating user game:", error);
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  drawStats() {
    if (this.state.stats === "{}") {
      return (
        <Row
          className="ranking-position"
          style={{ textAlign: "center" }}>
          <Col>
            No games yet
          </Col>
        </Row>
      )
    } else {
      const game = this.state.stats.games;
      return (
        <Container style={{ textAlign: "center" }}>
          <div className="stats topGameStats">
            <Row style={{ marginBottom: "2em" }}>
              <Col>
                <h4>Last Played Game</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>
                  {game.category}
                </h5>
              </Col>
            </Row>
            <Row className="ranking-position">
              <Col>
                {game.asserts}
              </Col>
              <Col>
                {game.fails}
              </Col>
            </Row>
            <Row>
              <Col>
                Rights
              </Col>
              <Col>
                Wrongs
              </Col>
            </Row>
          </div>
          <div className="stats gameResult">
            <Row>
              <Col style={{ textTransform: "uppercase" }}>
                <h4>{game.asserts > game.fails ? ("Won") : ("Lost")}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                {new Date(game.timeElapsed * 1000).toISOString().substr(11, 8)}
              </Col>
            </Row>
          </div>
          <div className="stats gameStats">
            <Row>
              <Col>
                <h3>Statistics</h3>
              </Col>
            </Row>
            <div style={{ textAlign: "left" }}>
              <Row>
                <Col>
                  Number of won games:
                </Col>
                <Col style={{ textAlign: "center" }}>
                  {this.state.stats.individualWonGames}
                </Col>
              </Row>
              <Row>
                <Col>
                  Number of lost games:
                </Col>
                <Col style={{ textAlign: "center" }}>
                  {this.state.stats.total - this.state.stats.individualWonGames}
                </Col>
              </Row>
              <Row>
                <Col>
                  Number of games played:
                </Col>
                <Col style={{ textAlign: "center" }}>
                  {this.state.stats.total}
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      )
    }
  }

  render() {
    return <Modal size="lg" show={this.props.show} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Game Statistics</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.state.loading ?
          (<Spinner
            className="loader"
            animation="border"
            role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>) :
          (<Container>
            {this.drawStats()}
          </Container>)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  }

}