export class LocalStorage {
    get = (key) => {
        if (typeof window != "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    };
    set = (key, value) => {
        if (typeof window !== "undefined") {
            return localStorage.setItem(key, value);
        }
    };
    remove = (key) => {
        if (typeof window !== "undefined") {
            return localStorage.removeItem(key);
        }
    };
}

export const LocalStorageKey = {
    ACCESS_TOKEN: "ACCESS_TOKEN"
}