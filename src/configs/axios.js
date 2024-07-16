import axios from "axios";
import { LocalStorage, LocalStorageKey } from "../utils/local-storage";
export const url = "http://localhost:3030/main/v1";

export const createAxios = () => {
    const accessToken = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
    return axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
        },
    });
};