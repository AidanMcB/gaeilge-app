export interface NoteCard {
    id: number;
    englishPhrase: string;
    irishPhrase: string;
    category?: string;
    tags?: string[];
    color?: string;
}

export interface NewNoteCardForm {
    englishPhrase: string;
    irishPhrase: string;
    newCategory?: string;
    id?: number
}

export interface DeleteNoteCardResp {
    status: number;
    message: string;
}

export interface HttpNoteCardResponse {
    status: number;
    message: string;
    notecard: NoteCard;
}