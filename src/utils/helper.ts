import type { StoredData } from "@/ts/interfaces";

export function getLocalStorage(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedData: StoredData = {} as StoredData;
    if (localStorageData) {
        storedData = JSON.parse(localStorageData);
    } 
    return storedData;
}