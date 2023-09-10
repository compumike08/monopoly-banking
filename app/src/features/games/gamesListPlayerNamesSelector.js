import { createSelector } from "@reduxjs/toolkit";

const getGamesList = (state) => state.gamesData.userGamesList;

export const selectGamesListWithMappedPlayerNames = createSelector(
  getGamesList,
  (gamesList) => {
    return gamesList.map((game) => {
      return {
        gameId: game.gameId,
        code: game.code,
        isCollectFromFreeParking: game.isCollectFromFreeParking,
        playerNames: game.players.map((player) => {
          return player.name;
        }),
      };
    });
  },
);
