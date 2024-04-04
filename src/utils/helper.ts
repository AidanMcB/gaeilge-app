import { MatchingDataKeys, MultipleChoiceDataKeys } from "@/ts/enums";
import type { StoredData } from "@/ts/interfaces";
import type { VocabStoredData } from "@/ts/matching.interfaces";

export function getLocalQuizData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedData: StoredData = {} as StoredData;
    if (localStorageData) {
        storedData = JSON.parse(localStorageData);
    } 
    return storedData;
}

export function getLocalVocabData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedData: VocabStoredData = {} as VocabStoredData;
    if (localStorageData) {
        storedData = JSON.parse(localStorageData);
    } 
    return storedData;
}

export function clearAllStoredData(): void {
    localStorage.removeItem(MultipleChoiceDataKeys.AnsweredQuestions);
    localStorage.removeItem(MultipleChoiceDataKeys.QuestionNumber);
    localStorage.removeItem(MatchingDataKeys.ErrorCount);
    localStorage.removeItem(MatchingDataKeys.AnsweredQuestions);
    localStorage.removeItem(MatchingDataKeys.GroupNumber);
}

export function randomSort(a: any, b: any): number {
    return 0.5 - Math.random();
}