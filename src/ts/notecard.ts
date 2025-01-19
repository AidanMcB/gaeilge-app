import type { Category } from './category';

export interface INoteCard {
    id: number;
    englishPhrase: string;
    irishPhrase: string;
    categories: Category[];
    tags?: string[];
    color?: string;
}

export interface NoteCardGridData {
    page: number;
    totalPages: number;
    pageSize: number;
    cards: INoteCard[];
}

export interface NewNoteCardForm {
    englishPhrase: string;
    irishPhrase: string;
    categories?: Category[];
    id?: number
}

export interface DeleteNoteCardResp {
    status: number;
    message: string;
}

export interface HttpNoteCardResponse {
    status: number;
    message: string;
    data: INoteCard;
}