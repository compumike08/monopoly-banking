import { createSelector } from "@reduxjs/toolkit";

const selectActiveGamePlayers = (state) => state.gamesData.activeGame.players;
const selectLoggedInPlayerId = (state) =>
  state.gamesData.activeGame.loggedInPlayerId;

export const selectActiveGamePlayersYouOnTop = createSelector(
  [selectActiveGamePlayers, selectLoggedInPlayerId],
  (players, loggedInPlayerId) => {
    const rawPlayers = Object.assign([], players);
    const playersWithoutYou = rawPlayers.filter(
      (player) => player.id !== loggedInPlayerId,
    );
    const youPlayer = rawPlayers.find(
      (player) => player.id === loggedInPlayerId,
    );
    const sortedPlayers = playersWithoutYou;
    sortedPlayers.unshift(youPlayer);
    return sortedPlayers;
  },
);

export const selectLoggedInPlayer = createSelector(
  [selectActiveGamePlayers, selectLoggedInPlayerId],
  (players, loggedInPlayerId) => {
    return players.find((player) => player.id === loggedInPlayerId);
  },
);
