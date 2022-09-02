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
import GameContainer from './features/gameView/GameContainer';
import UserManagement from './features/games/UserManagement';
import ExistingUser from './features/games/ExistingUser';

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
                  <Route path="/userManagement">
                      <UserManagement />
                  </Route>
                  <Route path="/existingUser">
                      <ExistingUser />
                  </Route>
                  <Route path="/newUser">
                      <NewUser />
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
