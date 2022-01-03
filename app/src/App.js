import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import TitleBar from "./features/TitleBar/TitleBar";
import HomePage from "./features/Home/HomePage";
import NewGame from './features/games/NewGame';
import NewUser from "./features/games/NewUser";
import JoinGame from "./features/games/JoinGame";
import GameView from "./features/gameView/GameView";

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
                  <Route path="/newUser">
                      <NewUser />
                  </Route>
                  <Route path="/joinGame">
                      <JoinGame />
                  </Route>
                  <Route path="/gameView">
                      <GameView />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
