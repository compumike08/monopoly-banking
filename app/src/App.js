import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from "./components/Home";
import './App.css';

function App() {
  return (
      <Router>
          <div className="App">
              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
