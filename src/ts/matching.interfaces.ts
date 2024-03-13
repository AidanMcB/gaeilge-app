export interface MatchingData {
    id: number;
    section: number;
    vocab: VocabGroup[];
}

export interface VocabGroup {
    id: number;
    terms: Term[];
}

export interface Term {
    id: number;
    englishTerm: string;
    irishTerm: string;
}