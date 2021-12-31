import axios from 'axios';
import { BACKEND_BASE_URL } from "../../constants/urls";

const API_ERROR_MSG = "API error";

export async function fetchGames() {
    const url = `${BACKEND_BASE_URL}/games/list`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(API_ERROR_MSG);
    }
}

export async function createNewGame() {
    const url = `${BACKEND_BASE_URL}/games/createNewGame`;
    try {
        const response = await axios.post(url);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(API_ERROR_MSG);
    }
}

export async function addNewUserToGame(gameId, data) {
    const url = `${BACKEND_BASE_URL}/games/game/${gameId}/createNewUser`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(API_ERROR_MSG);
    }
}
