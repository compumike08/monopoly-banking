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

export const selectSelectedTradeDetails = createSelector(
  [
    getAllProposedTradesFromProposingPlayer,
    (_state, selectedTradeId) => selectedTradeId,
    getAllProposedTradesToRequestedPlayer
  ],
  (
    allProposedTradesFromProposingPlayerList,
    selectedTradeId,
    allProposedTradesToRequestedPlayerList
  ) => {
    const fromProposingPlayerTrade =
      allProposedTradesFromProposingPlayerList.find(
        (proposedTrade) => proposedTrade.proposedTradeId === selectedTradeId
      );
    let toRequestedPlayerTrade = null;

    if (!fromProposingPlayerTrade) {
      toRequestedPlayerTrade = allProposedTradesToRequestedPlayerList.find(
        (proposedTrade) => proposedTrade.proposedTradeId === selectedTradeId
      );
    }

    if (fromProposingPlayerTrade) {
      return fromProposingPlayerTrade;
    }

    if (toRequestedPlayerTrade) {
      return toRequestedPlayerTrade;
    }

    // If unable to find the selected trade id in either array, throw an error
    throw new Error("Unable to find proposed trade by selected trade id");
  }
);
