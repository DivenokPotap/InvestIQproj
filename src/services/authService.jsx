import { ApiClient } from "./api";

export const signUp = async (userData) => {
    const response = await ApiClient.post(
        "/users/signup",
        userData
    );
    return response.data
}

export const signIn = async (userData) => {
    const { data } = await ApiClient.post(
        "/users/login",
        userData
    );
    return data;
}

export const signOut = async () => {
    const { data } = await ApiClient.post(
        "/users/logout",
    );
    return data;
}

export const getCurrent = async () => {
    const { data } = await ApiClient.get(
        "/users/current",
    );
    return data;
}