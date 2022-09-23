import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import TitleBar from "./features/TitleBar/TitleBar";
import HomePage from "./features/Home/HomePage";
import NewGame from './features/games/NewGame';
import NewGameConfirmation from './features/games/NewGameConfirmation';
import NewPlayer from './features/players/NewPlayer';
import JoinGame from "./features/games/JoinGame";
import GameContainer from './features/gameView/GameContainer';
import PlayerManagement from './features/players/PlayerManagement';
import ExistingPlayer from './features/players/ExistingPlayer';

import './App.css';

function App() {
  return (
      <Router>
          <div className="App">
              <TitleBar />
              <Switch>
                  <Route exact path="/">
                      <HomePage />
                  </Route>
                  <Route path="/newGame">
                      <NewGame />
                  </Route>
                  <Route path="/newGameConfirmation">
                    <NewGameConfirmation />
                  </Route>
                  <Route path="/playerManagement">
                      <PlayerManagement />
                  </Route>
                  <Route path="/existingPlayer">
                      <ExistingPlayer />
                  </Route>
                  <Route path="/newPlayer">
                      <NewPlayer />
                  </Route>
                  <Route path="/joinGame">
                      <JoinGame />
                  </Route>
                  <Route path="/gameView">
                      <GameContainer />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
