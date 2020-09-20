import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import TitleBar from "./components/TitleBar/TitleBar";
import Home from "./components/Home/Home";
import CreateNewGame from "./components/CreateNewGame/CreateNewGame";
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
