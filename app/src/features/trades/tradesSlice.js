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
  proposeTrade,
  cancelProposedTrade,
  rejectProposedTrade,
  acceptProposedTrade
} from "../../api/tradesAPI";

const initialState = {
  allProposedTradesFromProposingPlayer: [],
  allProposedTradesToRequestedPlayer: [],
  getAllProposedTradesByProposingPlayerStatus: IDLE_STATUS,
  getAllProposedTradesByRequestedPlayerStatus: IDLE_STATUS,
  proposeTradeStatus: IDLE_STATUS,
  cancelProposedTradeStatus: IDLE_STATUS,
  rejectProposedTradeStatus: IDLE_STATUS,
  acceptProposedTradeStatus: IDLE_STATUS
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

export const cancelProposedTradeAction = createAsyncThunk(
  "proposedTrades/cancelProposedTradeAction",
  async (proposedTradeId) => {
    return await cancelProposedTrade(proposedTradeId);
  }
);

export const rejectProposedTradeAction = createAsyncThunk(
  "proposedTrades/rejectProposedTradeAction",
  async (proposedTradeId) => {
    return await rejectProposedTrade(proposedTradeId);
  }
);

export const acceptProposedTradeAction = createAsyncThunk(
  "proposedTrades/acceptProposedTradeAction",
  async (proposedTradeId) => {
    return await acceptProposedTrade(proposedTradeId);
  }
);

const processProposedTradeUpdate = (state, action, isReceivedFromWs) => {
  const data = action.payload;

  if (isReceivedFromWs) {
    if (data.isProposedTradeCreated) {
      state.allProposedTradesToRequestedPlayer.push(data);
      const toastMessage = `${data.proposingPlayer.name} has proposed a trade with you`;
      toast.success(toastMessage);
    } else if (data.isProposedTradeCancelled) {
      state.allProposedTradesToRequestedPlayer =
        state.allProposedTradesToRequestedPlayer.filter(
          (proposedTrade) =>
            proposedTrade.proposedTradeId !== action.payload.proposedTradeId
        );
      const toastMessage = `${data.proposingPlayer.name} has cancelled a proposed trade with you`;
      toast.error(toastMessage);
    } else if (data.isProposedTradeRejected) {
      state.allProposedTradesFromProposingPlayer =
        state.allProposedTradesFromProposingPlayer.filter(
          (proposedTrade) =>
            proposedTrade.proposedTradeId !== action.payload.proposedTradeId
        );
      const toastMessage = `${data.requestedPlayer.name} has rejected a trade you proposed`;
      toast.error(toastMessage);
    } else if (data.isProposedTradeAccepted) {
      state.allProposedTradesFromProposingPlayer =
        state.allProposedTradesFromProposingPlayer.filter(
          (proposedTrade) =>
            proposedTrade.proposedTradeId !== action.payload.proposedTradeId
        );
      const toastMessage = `${data.proposingPlayer.name} and ${data.requestedPlayer.name} have completed a trade`;
      toast.info(toastMessage);
    }
  }
};

export const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    proposedTradeUpdateReceivedFromWs(state, action) {
      state = processProposedTradeUpdate(state, action, true);
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
      })
      .addCase(cancelProposedTradeAction.pending, (state) => {
        state.cancelProposedTradeStatus = LOADING_STATUS;
      })
      .addCase(cancelProposedTradeAction.fulfilled, (state, action) => {
        state.cancelProposedTradeStatus = IDLE_STATUS;
        state.allProposedTradesFromProposingPlayer =
          state.allProposedTradesFromProposingPlayer.filter(
            (proposedTrade) =>
              proposedTrade.proposedTradeId !== action.payload.proposedTradeId
          );
      })
      .addCase(cancelProposedTradeAction.rejected, (state) => {
        state.cancelProposedTradeStatus = ERROR_STATUS;
      })
      .addCase(rejectProposedTradeAction.pending, (state) => {
        state.rejectProposedTradeStatus = LOADING_STATUS;
      })
      .addCase(rejectProposedTradeAction.fulfilled, (state, action) => {
        state.rejectProposedTradeStatus = IDLE_STATUS;
        state.allProposedTradesToRequestedPlayer =
          state.allProposedTradesToRequestedPlayer.filter(
            (proposedTrade) =>
              proposedTrade.proposedTradeId !== action.payload.proposedTradeId
          );
      })
      .addCase(rejectProposedTradeAction.rejected, (state) => {
        state.rejectProposedTradeStatus = ERROR_STATUS;
      })
      .addCase(acceptProposedTradeAction.pending, (state) => {
        state.acceptProposedTradeStatus = LOADING_STATUS;
      })
      .addCase(acceptProposedTradeAction.fulfilled, (state, action) => {
        state.acceptProposedTradeStatus = IDLE_STATUS;
        state.allProposedTradesToRequestedPlayer =
          state.allProposedTradesToRequestedPlayer.filter(
            (proposedTrade) =>
              proposedTrade.proposedTradeId !== action.payload.proposedTradeId
          );
      })
      .addCase(acceptProposedTradeAction.rejected, (state) => {
        state.acceptProposedTradeStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = tradesSlice;

export const { proposedTradeUpdateReceivedFromWs } = actions;

export default reducer;
