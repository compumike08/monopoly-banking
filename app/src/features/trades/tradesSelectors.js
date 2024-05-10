import { createSelector } from "@reduxjs/toolkit";

const getAllProposedTradesFromProposingPlayer = (state) =>
  state.tradeData.allProposedTradesFromProposingPlayer;
const getAllProposedTradesToRequestedPlayer = (state) =>
  state.tradeData.allProposedTradesToRequestedPlayer;

export const selectAllProposedTradesFromProposingPlayer = createSelector(
  getAllProposedTradesFromProposingPlayer,
  (allProposedTradesFromProposingPlayerList) => {
    return allProposedTradesFromProposingPlayerList.map((proposedTrade) => {
      return {
        tradeId: proposedTrade.proposedTradeId,
        playerName: proposedTrade.proposingPlayer.name
      };
    });
  }
);

export const selectAllProposedTradesToRequestedPlayer = createSelector(
  getAllProposedTradesToRequestedPlayer,
  (allProposedTradesToRequestedPlayerList) => {
    return allProposedTradesToRequestedPlayerList.map((proposedTrade) => {
      return {
        tradeId: proposedTrade.proposedTradeId,
        playerName: proposedTrade.requestedPlayer.name
      };
    });
  }
);
