import type { HttpNoteCardResponse, DeleteNoteCardResp, NewNoteCardForm, INoteCard } from "@/ts/notecard.interfaces";
import { httpClient } from "./httpClient";

export async function _getAllNoteCards(): Promise<INoteCard[]> {
    try {
        const resp = await httpClient.get<INoteCard[]>('/notecards');
        return resp.data;
    } catch (err) {
        console.error('Failed to fetch Note Cards. Error: ', err);
        throw err;
    }
}

export async function _addNoteCard(newData: NewNoteCardForm): Promise<INoteCard> {
    try {
        const resp = await httpClient.post<INoteCard>('/notecards/create', newData);
        return resp.data;
    } catch (err) {
        console.error('Failed to fetch Note Cards. Error: ', err);
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

export async function _editNotecard(notecard: NewNoteCardForm): Promise<HttpNoteCardResponse> {
    try {
        const resp = await httpClient.put<HttpNoteCardResponse>(`/notecards/${notecard.id}`, notecard);
        return resp.data;
    } catch(err) {
        console.error(`Failed to update notecard with id ${notecard.id}. Error: `, err);
        throw err;
    }
}