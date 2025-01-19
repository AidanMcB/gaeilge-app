import type {
    HttpNoteCardResponse,
    DeleteNoteCardResp,
    NewNoteCardForm,
    INoteCard
} from "@/ts/notecard";
import { httpClient } from "./httpClient";

export async function _getAllNoteCards(): Promise<INoteCard[]> {
    try {
        const resp = await httpClient.get<INoteCard[]>("/notecards");
        return resp.data;
    } catch (err) {
        console.error("Failed to fetch Note Cards. Error: ", err);
        throw err;
    }
}

export async function _addNoteCard(newData: NewNoteCardForm): Promise<INoteCard> {
    try {
        const resp = await httpClient.post<INoteCard>("/notecards/create", newData);
        return resp.data;
    } catch (err) {
        console.error("Failed to create Note Card. Error: ", err);
        throw err;
    }
}

export async function _deleteNoteCard(id: number): Promise<DeleteNoteCardResp> {
    try {
        const resp = await httpClient.delete<DeleteNoteCardResp>(`/notecards/${id}`);
        return resp.data;
    } catch (err) {
        console.error(`Failed to delete Note Card with id ${id}. Error: `, err);
        throw err;
    }
}

export async function _editNoteCard(noteCard: NewNoteCardForm): Promise<HttpNoteCardResponse> {
    try {
        const resp = await httpClient.put<HttpNoteCardResponse>(
            `/notecards/${noteCard.id}`,
            noteCard
        );
        return resp.data;
    } catch (err) {
        console.error(`Failed to update notecard with id ${noteCard.id}. Error: `, err);
        throw err;
    }
}

export async function _removeCategoryFromNoteCard(
    noteCardId: number,
    categoryId: number
): Promise<any> {
    try {
        const resp = await httpClient.delete<any>(
            `/notecards/${noteCardId}/categories/${categoryId}`
        );
        return resp.data;
    } catch (err) {
        console.error("Failed to remove Category from NoteCard. Error: ", err);
        throw err;
    }
}
