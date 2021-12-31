import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import TitleBar from "./features/TitleBar/TitleBar";
import Home from "./features/Home/Home";
import CreateNewGame from "./features/games/CreateNewGame";
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
                  <Route path="/createNewGame">
                      <CreateNewGame />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
