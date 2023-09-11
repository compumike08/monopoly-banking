import { createSelector } from "@reduxjs/toolkit";

const selectActiveGameMoneySinks = (state) =>
  state.gamesData.activeGame.moneySinks;

export const selectActiveGameBankMoneySinkOnTop = createSelector(
  selectActiveGameMoneySinks,
  (moneySinks) => {
    const rawMoneySinks = moneySinks;
    const moneySinksWithoutBank = rawMoneySinks.filter((sink) => !sink.isBank);
    const bankMoneySink = rawMoneySinks.find((sink) => sink.isBank);
    const sortedMoneySinks = moneySinksWithoutBank;
    sortedMoneySinks.unshift(bankMoneySink);
    return sortedMoneySinks;
  }
);
