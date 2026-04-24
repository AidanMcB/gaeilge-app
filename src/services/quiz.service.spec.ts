import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as quizService from '@/services/quiz.service';
import { MultipleChoiceDataKeys } from '@/ts/Constants';
import type { QuizData } from '@/ts/Quiz';

describe('quiz.service', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('_getAllQuizData resolves with quiz list', async () => {
        const p = quizService._getAllQuizData();
        await vi.advanceTimersByTimeAsync(600);
        const data = await p;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toHaveProperty('section');
    });

    it('_getNewQuizById returns section quiz', async () => {
        const p = quizService._getNewQuizById(1);
        await vi.advanceTimersByTimeAsync(400);
        const quiz = await p;
        expect(quiz?.section).toBe(1);
    });

    it('_updateQuiz writes to localStorage', async () => {
        const quiz: QuizData = {
            id: 1,
            section: 1,
            description: 'test',
            questions: []
        };
        const p = quizService._updateQuiz(quiz);
        await vi.advanceTimersByTimeAsync(400);
        await p;
        const raw = localStorage.getItem(MultipleChoiceDataKeys.StoredQuizData);
        expect(raw).toBeTruthy();
        expect(JSON.parse(raw!)).toMatchObject({ section: 1 });
    });

    it('_getAvailableQuizSections reads default', async () => {
        const p = quizService._getAvailableQuizSections();
        await vi.advanceTimersByTimeAsync(400);
        const sections = await p;
        expect(sections).toEqual([1]);
    });

    it('_setAvailableQuizSections persists', async () => {
        const p = quizService._setAvailableQuizSections([1, 2]);
        await vi.advanceTimersByTimeAsync(400);
        await p;
        expect(JSON.parse(localStorage.getItem(MultipleChoiceDataKeys.AvailableSections)!)).toEqual([
            1, 2
        ]);
    });
});
