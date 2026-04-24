import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizStore } from '@/stores/useQuizStore';
import type { QuizData, QuizQuestion } from '@/ts/Quiz';
import * as quizService from '@/services/quiz.service';

vi.mock('@/services/quiz.service', () => ({
    _updateQuiz: vi.fn().mockResolvedValue(undefined),
    _getActiveQuizData: vi.fn(),
    _getAvailableQuizSections: vi.fn(),
    _setAvailableQuizSections: vi.fn().mockResolvedValue(undefined)
}));

function sampleQuestion(id: number, submitted = false): QuizQuestion {
    return {
        id,
        question: `Q${id}`,
        choices: ['a', 'b', 'c', 'd'],
        correctAnswer: 'a',
        reason: '',
        state: 'unanswered',
        selectedAnswer: '',
        submittedAnswer: '',
        category: '',
        isSubmitted: submitted,
        isCorrect: submitted ? true : undefined
    };
}

function sampleQuiz(): QuizData {
    return {
        id: 1,
        section: 1,
        description: 'Test',
        questions: [sampleQuestion(1), sampleQuestion(2)]
    };
}

describe('useQuizStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('isSectionUnlocked includes default section 1', () => {
        const store = useQuizStore();
        expect(store.isSectionUnlocked(1)).toBe(true);
    });

    it('startNewQuiz sets quiz data and persists', async () => {
        const store = useQuizStore();
        const data = sampleQuiz();
        await store.startNewQuiz(data);
        expect(store.quizData.section).toBe(1);
        expect(quizService._updateQuiz).toHaveBeenCalled();
    });

    it('initQuestionView sets active question', async () => {
        const store = useQuizStore();
        await store.startNewQuiz(sampleQuiz());
        await store.initQuestionView(1, 2);
        expect(store.activeQuestion.id).toBe(2);
    });

    it('submitAnswer marks question submitted', async () => {
        const store = useQuizStore();
        await store.startNewQuiz(sampleQuiz());
        await store.initQuestionView(1, 1);
        await store.submitAnswer({
            questionId: 1,
            isCorrect: true,
            selectedAnswer: 'a'
        });
        const q = store.quizData.questions.find((x) => x.id === 1);
        expect(q?.isSubmitted).toBe(true);
        expect(q?.isCorrect).toBe(true);
    });

    it('isLastQuestion is false until all submitted', async () => {
        const store = useQuizStore();
        await store.startNewQuiz(sampleQuiz());
        expect(store.isLastQuestion()).toBe(false);
        await store.submitAnswer({ questionId: 1, isCorrect: true, selectedAnswer: 'a' });
        expect(store.isLastQuestion()).toBe(false);
        await store.submitAnswer({ questionId: 2, isCorrect: true, selectedAnswer: 'a' });
        expect(store.isLastQuestion()).toBe(true);
    });

    it('randomNextQuestion picks from unanswered', async () => {
        const store = useQuizStore();
        await store.startNewQuiz(sampleQuiz());
        await store.submitAnswer({ questionId: 1, isCorrect: true, selectedAnswer: 'a' });
        const next = store.randomNextQuestion();
        expect(next).toBe(2);
    });
});
