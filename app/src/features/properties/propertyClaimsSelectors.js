import { createSelector } from "@reduxjs/toolkit";

const getAllPropertyClaimsList = (state) =>
  state.propertyClaimsData.allPropertyClaimsList;

export const selectCurrentlySelectedPlayerOwnedProperties = createSelector(
  [getAllPropertyClaimsList, (_state, selectedPlayerId) => selectedPlayerId],
  (allPropertyClaimsList, selectedPlayerId) => {
    return allPropertyClaimsList.filter(
      (propertyClaim) =>
        propertyClaim.ownedByPlayerId &&
        propertyClaim.ownedByPlayerId === parseInt(selectedPlayerId)
    );
  }
);

export const selectProposedTradePropertiesListProperties = createSelector(
  [
    getAllPropertyClaimsList,
    (_state, propertyClaimIdsList) => propertyClaimIdsList
  ],
  (allPropertyClaimsList, propertyClaimIdsList) => {
    return allPropertyClaimsList.filter((propertyClaim) =>
      propertyClaimIdsList.includes(propertyClaim.propertyClaimId)
    );
  }
);
