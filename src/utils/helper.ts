import { AnswerState, MatchingDataKeys, MultipleChoiceDataKeys } from '@/ts/enums';
import type { QuizData, QuizQuestion } from '@/ts/interfaces';
import type { Term, VocabSection } from '@/ts/matching';

export function getLocalQuizData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedQuizData: QuizData = {} as QuizData;
    if (localStorageData) {
        storedQuizData = JSON.parse(localStorageData);
    } 
    return storedQuizData;
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
    localStorage.removeItem(MultipleChoiceDataKeys.StoredQuizData);
    localStorage.removeItem(MultipleChoiceDataKeys.AnsweredQuestions);
    localStorage.removeItem(MultipleChoiceDataKeys.QuestionNumber);
    localStorage.removeItem(MatchingDataKeys.ErrorCount);
    localStorage.removeItem(MatchingDataKeys.StoredMatchingData);
    localStorage.removeItem(MatchingDataKeys.TermsToPractice);
}

export function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randomizeArr(arr: any[]): any[] {
    if (arr) {
        return  arr.sort(() => Math.random() - 0.5);
    } else {
        return [];
    }
}

export function calcPercent(num: number, total: number): number {
    return ((num / total)*100);
}

export function clearCachedQuestion(question: QuizQuestion): QuizQuestion {
    return {
        ...question,
        state: 'unanswered',
        selectedAnswer: '',
        isSubmitted: false,
        isCorrect: undefined,
    }
}

export function clearCachedQuiz(quiz: QuizData): QuizData {
    return {
        ...quiz,
        questions: quiz?.questions?.map(q => clearCachedQuestion(q)) || []
    };
}


export function clearCachedMatchingData(vocabSection: VocabSection): VocabSection {
    return {
        ...vocabSection,
        englishTerms: vocabSection?.englishTerms.map(term => clearAnsweredTerm(term)),
        irishTerms: vocabSection?.irishTerms.map(term => clearAnsweredTerm(term))
    };
}

export function clearAnsweredTerm(term: Term): Term {
    return {
        ...term,
        isSelected: false,
        state: AnswerState.Unanswered
    };
}

export const divideWithRemainder = (x: number, y: number): number[] => {
    return [Math.floor(x / y), x % y];
}
