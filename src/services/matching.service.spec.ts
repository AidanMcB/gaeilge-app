import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as matchingService from '@/services/matching.service';
import { MatchingDataKeys } from '@/ts/Constants';

describe('matching.service', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('_getAllMatchingData resolves with sections', async () => {
        const p = matchingService._getAllMatchingData();
        await vi.advanceTimersByTimeAsync(600);
        const data = await p;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    it('_getNewVocabSectionById returns matching section', async () => {
        const p = matchingService._getNewVocabSectionById(1);
        await vi.advanceTimersByTimeAsync(400);
        const section = await p;
        expect(section?.id).toBe(1);
    });

    it('_updateActiveVocabSection persists', async () => {
        const section = { id: 1, section: 1, englishTerms: [], irishTerms: [] };
        const p = matchingService._updateActiveVocabSection(section as never);
        await vi.advanceTimersByTimeAsync(400);
        await p;
        expect(localStorage.getItem(MatchingDataKeys.StoredMatchingData)).toBeTruthy();
    });

    it('_getTermsToPractice returns empty array by default', async () => {
        const p = matchingService._getTermsToPractice();
        await vi.advanceTimersByTimeAsync(400);
        const terms = await p;
        expect(terms).toEqual([]);
    });
});
