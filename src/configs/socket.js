import { io } from 'socket.io-client';
import { LocalStorage, LocalStorageKey } from "../utils/local-storage";
// const URL = process.env.ENV == 'dev' ? 'http://localhost:3030' : process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function socketIo() {
    let token = "";

    // get token from local storage
    if (typeof window !== "undefined") {
        token = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
    }

    const socket = io('ws://localhost:3030', {
        autoConnect: false,
        extraHeaders: {
            token: token
        }

    });
    return socket;
}
