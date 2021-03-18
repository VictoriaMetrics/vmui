export type StorageKeys = "PREFERRED_URL" | "LAST_QUERY";

export const saveToStorage = (key: StorageKeys, value: string): void => {
  window.localStorage.setItem(key, value);
};

export const getFromStorage = (key: StorageKeys) => window.localStorage.getItem(key);
