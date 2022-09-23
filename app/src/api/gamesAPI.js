import axios from 'axios';

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';

function createJWTToken(token) {
    return 'Bearer ' + token;
}

function isUserLoggedIn() {
    let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) return false
    return true
}

function setupAxiosInterceptors(token) {
    axios.interceptors.request.use(
        (config) => {
            if (isUserLoggedIn()) {
                config.headers.authorization = token
            }
            return config
        }
    )
}

export function registerSuccessfulLoginForJwt(username, token) {
    sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    setupAxiosInterceptors(createJWTToken(token));
}

export async function authenticate(userCode) {
    const url = `/authenticate`;
    try {
        const response = await axios.post(url, {
            username: userCode,
            password: userCode
        });
        return response.data.token;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export async function fetchGames() {
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

export async function joinGameAsExistingPlayer(gameId, playerCode) {
    const url = `/games/game/${gameId}/player/${playerCode}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}
