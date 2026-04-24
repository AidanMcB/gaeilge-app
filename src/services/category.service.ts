import httpClient from "./httpClient";
import type { Category } from "@/ts/Category";

export async function _getAllCategories(): Promise<Category[]> {
    try {
        const resp = await httpClient.get<Category[]>("/categories");
        return resp.data;
    } catch (err) {
        console.error("Failed to fetch Categories. Error: ", err);
        throw err;
    }
}

export async function _addNewCategory(category: string): Promise<Category> {
    try {
        const resp = await httpClient.post<Category>("/categories/create", { name: category });
        return resp.data;
    } catch (err) {
        console.error("Failed to create Category. Error: ", err);
        throw err;
    }
}
