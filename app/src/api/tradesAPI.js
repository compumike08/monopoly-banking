import axios from "axios";

export async function getAllProposedTradesByProposingPlayerId(playerId) {
  const url = `/proposedTrades/player/${playerId}/listAllProposedTradesByProposingPlayerId`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function getAllProposedTradesByRequestedPlayerId(playerId) {
  const url = `/proposedTrades/player/${playerId}/listAllProposedTradesByRequestedPlayerId`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function proposeTrade(data) {
  const url = `/proposedTrades/proposeTrade`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
