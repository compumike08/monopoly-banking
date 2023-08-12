import axios from 'axios';
import { USER_NAME_SESSION_ATTRIBUTE_NAME, TOKEN_SESSION_ATTRIBUTE_NAME } from "../constants/general";

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

export function registerSuccessfulLoginForJwt(username, token) {
    const bearerToken = createJWTToken(token);
    sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    sessionStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, bearerToken);
    setupAxiosInterceptors(bearerToken);
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
        registerSuccessfulLoginForJwt(data.username, response.data.token);
        return response.data.token;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
};

export function logout() {
    sessionStorage.clear();
    axios.interceptors.request.eject(axiosHeaderInterceptor);
    axiosHeaderInterceptor = null;
}
