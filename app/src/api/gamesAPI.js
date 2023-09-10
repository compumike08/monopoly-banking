import axios from "axios";

export async function fetchGamesByUser() {
  const url = `/games/list`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function fetchGameByCode(gameCode) {
  const url = `/games/gameCode/${gameCode}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function createNewGame(data) {
  const url = `/games/createNewGame`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function addNewPlayerToGame(gameId, data) {
  const url = `/games/game/${gameId}/createNewPlayer`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function joinGameAsExistingPlayer(gameId) {
  const url = `/games/game/${gameId}/player`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
