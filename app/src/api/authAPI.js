import axios from 'axios';
import IdTokenVerifier from 'idtoken-verifier';
import { TOKEN_SESSION_ATTRIBUTE_NAME } from "../constants/general";
import { updateStompClientAuthTokenFromStorage } from "../stomp/stompClient";

let axiosHeaderInterceptor = null;

function createJWTToken(token) {
    return 'Bearer ' + token;
};

function isUserLoggedIn() {
    const token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
    if (token === null) return false;
    return true;
};

function setupAxiosInterceptors(token) {
    axiosHeaderInterceptor = axios.interceptors.request.use(
        (config) => {
            if (isUserLoggedIn()) {
                config.headers.authorization = token;
            }
            return config;
        }
    );
};

export function registerSuccessfulLoginForJwt(token) {
    const bearerToken = createJWTToken(token);
    sessionStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, bearerToken);
    setupAxiosInterceptors(bearerToken);

    const verifier = new IdTokenVerifier({});

    const decodedToken = verifier.decode(token).payload;

    const secsUntilExpiration = decodedToken.exp - Math.floor(Date.now() / 1000);
    
    // The value of 120 represents 120 seconds, or two minutes
    const timerValueForRefresh = secsUntilExpiration - 120;

    // The value of 60 represents 60 seconds, or one minute
    if (timerValueForRefresh < 60) {
        console.log("Unable to set refresh token timer due to token expiring too soon");
        throw new Error("Error setting refresh token timer");
    }

    setTimeout(refreshToken, timerValueForRefresh * 1000);
};

export async function registerUser(data) {
    const url = `/registerUser`;
    try {
        const response = await axios.post(url, {
            username: data.username,
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
};

export async function authenticate(data) {
    const url = `/authenticate`;
    try {
        const response = await axios.post(url, {
            username: data.username,
            password: data.password
        });
        registerSuccessfulLoginForJwt(response.data.token);
        return response.data.token;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
};

export async function refreshToken() {
    const url = `/refresh`;
    try {
        const response = await axios.post(url);
        registerSuccessfulLoginForJwt(response.data.token);
        updateStompClientAuthTokenFromStorage();
        return response.data.token;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export async function sendPasswordResetEmail(data) {
    const url = `/sendForgotPasswordEmail`;
    try {
        await axios.post(url, {
            email: data.email
        });
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export async function resetPassword(data) {
    const url = `/resetPassword`;
    try {
        await axios.post(url, {
            forgotPasswordToken: data.forgotPasswordToken,
            newPassword: data.newPassword
        });
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export function logout() {
    sessionStorage.clear();
    axios.interceptors.request.eject(axiosHeaderInterceptor);
    axiosHeaderInterceptor = null;
}
