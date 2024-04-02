import { KEYCLOAK_CLIENT_SECRET, KEYCLOACK_URL } from './../core/Constants';
import axios from "axios"
import SecureLS from "secure-ls";
import { KEYCLOAK_CLIENT_ID } from "../core/Constants";

const ls = new SecureLS({encodingType: 'aes'});

const prefKeycloakToken = "KEYCLOAK_TOKEN";
const prefKeycloakTokenExp = "KEYCLOAK_TOKEN_EXP";


export async function getKeycloakToken() {
    const expStr = ls.get(prefKeycloakTokenExp);
    if(!expStr || new Date() > new Date(expStr)) {
        return await generateToken();
    }

    return ls.get(prefKeycloakToken);
}

const generateToken = async () => {
    
    const formData = new URLSearchParams({
        clientId: KEYCLOAK_CLIENT_ID,
        clientSecret: KEYCLOAK_CLIENT_SECRET
    });
    const res = await axios.get("/tokens?" + formData);
    const now = new Date().getTime();
    const nowDate = new Date(now + (res.data.expires_in - 30) * 10 )  
    ls.set(prefKeycloakTokenExp, nowDate.toISOString());
    ls.set(prefKeycloakToken, res.data.access_token);
    return res.data.access_token;
}

export const connectUser = (username, password) => {
    const formData = new URLSearchParams({
        clientId: username,
        clientSecret: password
    });
    return  axios.get("/tokens?" + formData);
}

export const saveUserToken = (token) => {
    const now = new Date().getTime();
    const nowDate = new Date(now + (token.expires_in - 30) * 1000)  
    ls.set(prefKeycloakTokenExp, nowDate.toISOString());
    ls.set(prefKeycloakToken, token.access_token);
}

export const getUserToken = () => {
    return ls.get(prefKeycloakToken);
}

export const isTokenExpired = () => {
    const expStr = ls.get(prefKeycloakTokenExp);

    if(expStr && new Date() > new Date(expStr)) {
        return true;
    } else {
        return false;
    }
}



export const logoutUser = () => {
    ls.removeAll();
}