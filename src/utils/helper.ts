import { MatchingDataKeys, MultipleChoiceDataKeys } from '@/ts/enums';
import type { QuizQuestion, SubmittedData } from '@/ts/interfaces';
import type { VocabSection } from '@/ts/matching.interfaces';

export function getLocalQuizData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let submittedData: SubmittedData = {} as SubmittedData;
    if (localStorageData) {
        submittedData = JSON.parse(localStorageData);
    } 
    return submittedData;
}

export function getLocalVocabData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedData: VocabSection = {} as VocabSection;
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
    localStorage.clear();
}

export function randomSort(a: any, b: any): number {
    return 0.5 - Math.random();
}

export function randomNextQuestion(allQuestions: QuizQuestion[], submittedQuestions: QuizQuestion[]): number {
    const allQuestionIds: number[] = allQuestions.map(q => q.id);
    const answeredQuestionIds: number[] = submittedQuestions?.map(q => q.id) || [];
    const remainingQuestionIds = allQuestionIds.filter(id => !answeredQuestionIds.includes(id));
    return remainingQuestionIds[Math.floor(Math.random()*remainingQuestionIds.length)];
}

export function calcPercent(num: number, total: number): number {
    return ((num / total)*100);
}