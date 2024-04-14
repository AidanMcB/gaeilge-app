import type { AnswerState, Language } from './enums';

export interface VocabSection {
    id: number;
    section: number,
    englishTerms: Term[];
    irishTerms: Term[];
}

export interface Term {
    id: number;
    phrase: string;
    isSelected?: boolean;
    lang?: LanguageType;
    state?: AnswerStateType;
}

export interface VocabSubmittedData {
    section: number;
    submittedTerms: Term[];
    score?: number
}

export type LanguageType = Language.English | Language.Irish;

export type AnswerStateType = AnswerState.Correct | AnswerState.Incorrect | AnswerState.Unanswered;