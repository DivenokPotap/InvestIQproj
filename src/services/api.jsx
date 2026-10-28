import axios from "axios";

export const ApiClient = axios.create({
    baseURL: "https://connections-api.goit.global",
});

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
