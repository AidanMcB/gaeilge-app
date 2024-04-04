import type { AnswerState, Language } from "./enums";

export interface MatchingData {
    id: number;
    section: number;
    vocab: VocabGroup[];
}

export interface VocabGroup {
    id: number;
    englishTerms: Term[];
    irishTerms: Term[];
}

export interface Term {
    id: number;
    phrase: string;
    state?: AnswerStateType;
}

export interface VocabStoredData {
    groupId: number;
    submittedAnswers: VocabGroup[];
}

export type LanguageType = Language.English | Language.Irish;

export type AnswerStateType = AnswerState.Correct | AnswerState.Incorrect | AnswerState.Unanswered;