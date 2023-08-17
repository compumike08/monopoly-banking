import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import TitleBar from "./features/TitleBar/TitleBar";
import UserProfile from './features/userProfile/UserProfile';
import AboutPage from './features/about/AboutPage';
import HomePage from "./features/Home/HomePage";
import AuthLanding from './features/auth/AuthLanding';
import RegisterUser from './features/auth/RegisterUser';
import LoginPage from './features/auth/LoginPage';
import NewGame from './features/games/NewGame';
import NewGameConfirmation from './features/games/NewGameConfirmation';
import NewPlayer from './features/players/NewPlayer';
import JoinGame from "./features/games/JoinGame";
import GamesList from './features/games/GamesList';
import GameContainer from './features/gameView/GameContainer';
import RequestPasswordReset from './features/auth/RequestPasswordReset';
import ResetPassword from './features/auth/ResetPassword';

import './App.css';

function App() {
  return (
      <Router>
          <div className="App">
              <TitleBar />
              <Switch>
                  <Route exact path="/">
                      <AuthLanding />
                  </Route>
                  <Route path="/registerUser">
                    <RegisterUser />
                  </Route>
                  <Route path="/login" >
                    <LoginPage />
                  </Route>
                  <Route path="/about" >
                    <AboutPage />
                  </Route>
                  <Route path="/requestPasswordReset" >
                    <RequestPasswordReset />
                  </Route>
                  <Route path="/resetPassword" >
                    <ResetPassword />
                  </Route>
                  <Route path="/userProfile" >
                    <UserProfile />
                  </Route>
                  <Route path="/home">
                      <HomePage />
                  </Route>
                  <Route path="/newGame">
                      <NewGame />
                  </Route>
                  <Route path="/newGameConfirmation">
                    <NewGameConfirmation />
                  </Route>
                  <Route path="/newPlayer">
                      <NewPlayer />
                  </Route>
                  <Route path="/joinGame">
                      <JoinGame />
                  </Route>
                  <Route path="/listGames">
                      <GamesList />
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
