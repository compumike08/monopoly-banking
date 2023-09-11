import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  getAllPropertyClaimsList,
  purchasePropertyClaimFromBank,
  mortgageProperty,
  unmortgageProperty
} from "../../api/propertiesAPI";

const initialState = {
  allPropertyClaimsList: [],
  getAllPropertyClaimsListStatus: IDLE_STATUS,
  purchasePropertyClaimFromBankStatus: IDLE_STATUS,
  mortgagePropertyStatus: IDLE_STATUS,
  unmortgagePropertyStatus: IDLE_STATUS
};

export const getAllPropertyClaimsAction = createAsyncThunk(
  "propertyClaims/getAllPropertyClaimsAction",
  async (gameId) => {
    return await getAllPropertyClaimsList(gameId);
  }
);

export const purchasePropertyClaimFromBankAction = createAsyncThunk(
  "propertyClaims/purchasePropertyClaimFromBankAction",
  async (data) => {
    return await purchasePropertyClaimFromBank(data);
  }
);

export const mortgagePropertyAction = createAsyncThunk(
  "propertyClaims/mortgageProperty",
  async (data) => {
    return mortgageProperty(data);
  }
);

export const unmortgagePropertyAction = createAsyncThunk(
  "propertyClaims/unmortgageProperty",
  async (data) => {
    return unmortgageProperty(data);
  }
);

const processPropertyClaimUpdate = (state, action, isReceivedFromWs) => {
  const data = action.payload;

  const propertyClaimArrayIndex = state.allPropertyClaimsList.findIndex(
    (element) => element.propertyClaimId === data.propertyClaimId
  );
  state.allPropertyClaimsList[propertyClaimArrayIndex] = data;

  if (isReceivedFromWs) {
    if (data.isMortgagingPropertyMsg) {
      const toastMessage = `${data.ownedByPlayerName} has mortgaged ${data.name}`;
      toast.success(toastMessage);
    } else if (data.isUnmortgagingPropertyMsg) {
      const toastMessage = `${data.ownedByPlayerName} has unmortgaged ${data.name}`;
      toast.success(toastMessage);
    } else {
      const toastMessage = `${data.ownedByPlayerName} now owns ${data.name}`;
      toast.success(toastMessage);
    }
  }

  return state;
};

export const propertyClaimsSlice = createSlice({
  name: "propertyClaims",
  initialState,
  reducers: {
    propertyClaimUpdateReceivedFromWs(state, action) {
      state = processPropertyClaimUpdate(state, action, true);
    },
    resetPropertyClaimsData() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPropertyClaimsAction.pending, (state) => {
        state.getAllPropertyClaimsListStatus = LOADING_STATUS;
      })
      .addCase(getAllPropertyClaimsAction.fulfilled, (state, action) => {
        state.getAllPropertyClaimsListStatus = IDLE_STATUS;
        state.allPropertyClaimsList = action.payload;
      })
      .addCase(getAllPropertyClaimsAction.rejected, (state) => {
        state.getAllPropertyClaimsListStatus = ERROR_STATUS;
      })
      .addCase(purchasePropertyClaimFromBankAction.pending, (state) => {
        state.purchasePropertyClaimFromBankStatus = LOADING_STATUS;
      })
      .addCase(
        purchasePropertyClaimFromBankAction.fulfilled,
        (state, action) => {
          state = processPropertyClaimUpdate(state, action, false);
          state.purchasePropertyClaimFromBankStatus = IDLE_STATUS;
        }
      )
      .addCase(purchasePropertyClaimFromBankAction.rejected, (state) => {
        state.purchasePropertyClaimFromBankStatus = ERROR_STATUS;
      })
      .addCase(mortgagePropertyAction.pending, (state) => {
        state.mortgagePropertyStatus = LOADING_STATUS;
      })
      .addCase(mortgagePropertyAction.fulfilled, (state, action) => {
        state = processPropertyClaimUpdate(state, action, false);
        state.mortgagePropertyStatus = IDLE_STATUS;
      })
      .addCase(mortgagePropertyAction.rejected, (state) => {
        state.mortgagePropertyStatus = ERROR_STATUS;
      })
      .addCase(unmortgagePropertyAction.pending, (state) => {
        state.unmortgagePropertyStatus = LOADING_STATUS;
      })
      .addCase(unmortgagePropertyAction.fulfilled, (state, action) => {
        state = processPropertyClaimUpdate(state, action, false);
        state.unmortgagePropertyStatus = IDLE_STATUS;
      })
      .addCase(unmortgagePropertyAction.rejected, (state) => {
        state.unmortgagePropertyStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = propertyClaimsSlice;

export const { propertyClaimUpdateReceivedFromWs, resetPropertyClaimsData } =
  actions;

export default reducer;
