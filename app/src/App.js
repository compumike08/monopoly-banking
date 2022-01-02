import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import TitleBar from "./features/TitleBar/TitleBar";
import Home from "./features/Home/Home";
import GamesList from "./features/games/GamesList";
import NewGame from './features/games/NewGame';
import './App.css';

function App() {
  return (
      <Router>
          <div className="App">
              <TitleBar />
              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
                  <Route path="/gamesList">
                      <GamesList />
                  </Route>
                  <Route path="/newGame">
                      <NewGame />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
