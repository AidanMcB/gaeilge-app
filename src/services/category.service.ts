import { httpClient } from "./httpClient";

// To Do: improve API return types
export async function _getAllCategories(): Promise<any[]> {
    try {
        const resp = await httpClient.get<any[]>("/categories");
        return resp.data;
    } catch (err) {
        console.error("Failed to fetch Categories. Error: ", err);
        throw err;
    }
}

export async function _addNewCategory(category: string): Promise<any> {
    try {
        const resp = await httpClient.post<any>("/categories/create", { name: category });
        return resp.data;
    } catch (err) {
        console.error("Failed to create Category. Error: ", err);
        throw err;
    }
}
