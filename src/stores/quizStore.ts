import type { Answer, QuizQuestion, QuizData } from '@/ts/interfaces';
import { defineStore } from 'pinia';
import { clearCachedQuestion, clearCachedQuiz } from '@/utils/helper';
import * as quizService from '@/services/quiz.service';
import { computed, ref } from 'vue';

export const useQuizStore = defineStore('quizStore', () => {
    const quizData = ref<QuizData>({} as QuizData);
    const activeQuestion = ref<QuizQuestion>({} as QuizQuestion);
    const unlockedSections = ref<number[]>([1]);
    const selected = ref<string>('');

    async function startNewQuiz(data: QuizData): Promise<number> {
        clearQuizData(); // remove all existing quiz data from the DB and State
        setQuizData(data);
        updateQuizInDb();
        return Math.floor(Math.random() * 10)+1;
    }

    async function initQuestionView(sectionId: number, questionId: number): Promise<void> {
        if (!quizData.value || !quizData.value.questions) {
            const fetchedQuizData = await getActiveQuizDataFromDb();
            if (fetchedQuizData) {
                quizData.value = fetchedQuizData;
            }
        }
        setActiveQuestion(questionId);
        selected.value = '';
    }

    function setActiveQuestion(questionId: number): void {
		const question = quizData.value.questions.find((q) => q.id == questionId);
		if (question) {
            activeQuestion.value = question;
		}
	}

    function setQuizData(data: QuizData): void {
        quizData.value = data;
    }

    async function updateQuizInDb(): Promise<void> {
        try {
            quizService._updateQuiz(quizData.value);
        } catch (err) {
            console.error('Failed to update quiz data. Error: ', err);
        }
    }

    function updateSelected(val: string): void {
        selected.value = val;
    }

    async function getActiveQuizDataFromDb(): Promise<QuizData | void> {
        try {
            const quiz = quizService._getActiveQuizData();
            if (quiz) {
                return quiz;
            }
        } catch (err) {
            console.error('Failed to get active Quiz Data. Error: ', err);
        }
    }

    function isSectionUnlocked(section: number): boolean {
        return unlockedSections.value.includes(section)
    }

    async function submitAnswer(answer: Answer): Promise<void> {
        const newQuestionData: QuizQuestion = {
            ...activeQuestion.value,
            selectedAnswer: answer.selectedAnswer,
            submittedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
        };

        const index: number = quizData.value.questions.findIndex(q => q.id === answer.questionId);
        if (index > -1) {
            quizData.value.questions.splice(index, 1, newQuestionData);
            await updateQuizInDb();
            return;
        }
        if (!index) {
            // question does not exist
            console.error('Question was not found. Try refreshing the page and submitting again.');
            return;
        }
    }

    function randomNextQuestion(): number {
        const unansweredQuestions: QuizQuestion[] = quizData.value.questions.filter(q => !q.isSubmitted);
        const remainingQuestionIds = unansweredQuestions.map(q => q.id);
        return remainingQuestionIds[Math.floor(Math.random()*remainingQuestionIds.length)];
    }

    function isLastQuestion() {
        return quizData.value.questions.every(q => q.isSubmitted === true);
    }

    function clearQuizData(): void {
        // Because currently using JSON file instead of db, some caching is throwing things off
        // these functions reset any possible cached data by reassigning to desired empty values
        quizData.value = clearCachedQuiz(quizData.value);
        activeQuestion.value = clearCachedQuestion(activeQuestion.value);
        selected.value = '';
    }

    async function unlockSection(section: number): Promise<void> {
        if (!unlockedSections.value.includes(section)) {
            unlockedSections.value = [...unlockedSections.value, section];
            try {
               await quizService._setAvailableQuizSections(unlockedSections.value);
            } catch (err) {
                console.error('Unable to set available quiz sections. Error: ', err);
            }
        }
    }

    const answeredQuestionCount = computed(() => quizData.value?.questions?.filter(q => q.isSubmitted === true).length);


    return {
        answeredQuestionCount,
        quizData,
        activeQuestion,
        selected,
        unlockSection,
        startNewQuiz,
        isSectionUnlocked,
        initQuestionView,
        submitAnswer,
        isLastQuestion,
        randomNextQuestion,
        updateSelected,
        clearQuizData,
        getActiveQuizDataFromDb
    }

});