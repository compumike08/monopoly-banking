import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  getAllProposedTradesByProposingPlayerId,
  getAllProposedTradesByRequestedPlayerId,
  proposeTrade
} from "../../api/tradesAPI";

const initialState = {
  allProposedTradesFromProposingPlayer: [],
  allProposedTradesToRequestedPlayer: [],
  getAllProposedTradesByProposingPlayerStatus: IDLE_STATUS,
  getAllProposedTradesByRequestedPlayerStatus: IDLE_STATUS,
  proposeTradeStatus: IDLE_STATUS
};

export const getAllProposedTradesByProposingPlayerAction = createAsyncThunk(
  "proposedTrades/getAllProposedTradesByProposingPlayerAction",
  async (playerId) => {
    return await getAllProposedTradesByProposingPlayerId(playerId);
  }
);

export const getAllProposedTradesByRequestedPlayerAction = createAsyncThunk(
  "proposedTrades/getAllProposedTradesByRequestedPlayerAction",
  async (playerId) => {
    return await getAllProposedTradesByRequestedPlayerId(playerId);
  }
);

export const proposeTradeAction = createAsyncThunk(
  "proposedTrades/proposeTradeAction",
  async (data) => {
    return await proposeTrade(data);
  }
);

const processProposedTradeCreated = (state, action, isReceivedFromWs) => {
  const data = action.payload;

  state.allProposedTradesToRequestedPlayer.push(data);

  if (isReceivedFromWs) {
    const toastMessage = `${data.proposingPlayer.name} has proposed a trade with you`;
    toast.success(toastMessage);
  }
};

export const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    proposedTradeCreatedReceivedFromWs(state, action) {
      state = processProposedTradeCreated(state, action, true);
    },
    resetAllProposedTradesData() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProposedTradesByProposingPlayerAction.pending, (state) => {
        state.getAllPropertyClaimsListStatus = LOADING_STATUS;
      })
      .addCase(
        getAllProposedTradesByProposingPlayerAction.fulfilled,
        (state, action) => {
          state.getAllPropertyClaimsListStatus = IDLE_STATUS;
          state.allProposedTradesFromProposingPlayer = action.payload;
        }
      )
      .addCase(
        getAllProposedTradesByProposingPlayerAction.rejected,
        (state) => {
          state.getAllPropertyClaimsListStatus = ERROR_STATUS;
        }
      )
      .addCase(getAllProposedTradesByRequestedPlayerAction.pending, (state) => {
        state.getAllProposedTradesByRequestedPlayerStatus = LOADING_STATUS;
      })
      .addCase(
        getAllProposedTradesByRequestedPlayerAction.fulfilled,
        (state, action) => {
          state.getAllProposedTradesByRequestedPlayerStatus = IDLE_STATUS;
          state.allProposedTradesToRequestedPlayer = action.payload;
        }
      )
      .addCase(
        getAllProposedTradesByRequestedPlayerAction.rejected,
        (state) => {
          state.getAllProposedTradesByRequestedPlayerStatus = ERROR_STATUS;
        }
      )
      .addCase(proposeTradeAction.pending, (state) => {
        state.proposeTradeStatus = LOADING_STATUS;
      })
      .addCase(proposeTradeAction.fulfilled, (state, action) => {
        state.proposeTradeStatus = IDLE_STATUS;
        state.allProposedTradesFromProposingPlayer.push(action.payload);
      })
      .addCase(proposeTradeAction.rejected, (state) => {
        state.proposeTradeStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = tradesSlice;

export const { proposedTradeCreatedReceivedFromWs } = actions;

export default reducer;
