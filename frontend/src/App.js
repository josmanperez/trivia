import './App.css';
import * as React from 'react';
import { app } from "./index";
import {
  Container
} from 'react-bootstrap';
import LoginFields from './components/LoginFields';
import Category from './components/Categories';
import Questions from './components/Questions';
import GameStats from './components/GameStats';
import Ranking from './components/Ranking';

function App() {

  // State for Log-in, based on Anonymous vs non-Anonymous authentication
  const [loggedIn, setLoggedIn] = React.useState(
    app.currentUser
      ? true
      : false
  );

  const [play, setPlay] = React.useState(false);
  const [showRanking, setShowRanking] = React.useState(false);
  const [showLastGame, setShowLastGame] = React.useState(false);
  const [category, setCategory] = React.useState({});

  return (
    <div style={{ paddingBottom: "1rem" }}>
      {play && <Questions
        category={category}
        setCategory={setCategory}
        play={play}
        setPlay={setPlay}
        setShowLastGame={setShowLastGame} />}
      {showRanking && <Ranking
        show={showRanking}
        setShow={setShowRanking} />}
      {showLastGame && <GameStats
        show={showLastGame}
        setShow={setShowLastGame} />}
      <LoginFields
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        setShowRanking={setShowRanking}
        setShowLastGame={setShowLastGame} />
      <div className='jumbotron'>
        <Container className="header">
          <h3 className="display-3">
            Welcome to the Trivia game!
          </h3>
        </Container>
      </div>
      {!loggedIn ?
        (<Container className="text-center">
          <h3 className="mt-5">Please, Login or Register to play!</h3>
        </Container>) :
        (<Category
          play={play}
          setPlay={setPlay}
          category={category}
          setCategory={setCategory} />)
      }
    </div>
  );
}

export default App;
