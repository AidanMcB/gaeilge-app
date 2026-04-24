import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMatchingStore } from '@/stores/useMatchingStore';
import type { Term, VocabSection } from '@/ts/Matching';
import { AnswerState, Language } from '@/ts/Constants';
import * as matchingService from '@/services/matching.service';

vi.mock('@/services/matching.service', () => ({
    _updateActiveVocabSection: vi.fn().mockResolvedValue(undefined),
    _getActiveVocabSection: vi.fn(),
    _getTermsToPractice: vi.fn(),
    _setTermsToPractice: vi.fn().mockResolvedValue(undefined),
    _updateMatchingErrorCount: vi.fn().mockResolvedValue(undefined)
}));

function term(id: number, phrase: string, state = AnswerState.Unanswered): Term {
    return { id, phrase, state, lang: Language.English, isSelected: false };
}

function sampleVocab(): VocabSection {
    const ids = [1, 2, 3, 4, 5];
    const english = ids.map((id) => term(id, `en-${id}`));
    const irish = ids.map((id) => ({ ...term(id, `ga-${id}`), lang: Language.Irish }));
    return { id: 1, section: 1, englishTerms: english, irishTerms: irish };
}

describe('useMatchingStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('getPercentageAnswered returns undefined when empty', () => {
        const store = useMatchingStore();
        store.vocabData = { id: 1, section: 1, englishTerms: [], irishTerms: [] };
        expect(store.getPercentageAnswered()).toBeUndefined();
    });

    it('isComplete is true when all english terms correct', () => {
        const store = useMatchingStore();
        const t1 = { ...term(1, 'a'), state: AnswerState.Correct };
        const t2 = { ...term(2, 'b'), state: AnswerState.Correct };
        store.vocabData = { id: 1, section: 1, englishTerms: [t1, t2], irishTerms: [] };
        expect(store.isComplete()).toBe(true);
    });

    it('startNewMatching seeds vocab and clears loading', async () => {
        vi.mocked(matchingService._getActiveVocabSection).mockResolvedValue({
            id: 0,
            section: 0,
            englishTerms: [],
            irishTerms: []
        });
        const store = useMatchingStore();
        const data = sampleVocab();
        await store.startNewMatching(data);
        expect(store.vocabData.section).toBe(1);
        expect(store.isLoading).toBe(false);
    });

    it('getTranslatedTerm returns Irish for English term', () => {
        const store = useMatchingStore();
        const en = { ...term(1, 'one'), lang: Language.English };
        const ga = { ...term(1, 'aon'), lang: Language.Irish };
        store.vocabData = { id: 1, section: 1, englishTerms: [en], irishTerms: [ga] };
        const out = store.getTranslatedTerm(en);
        expect(out.phrase).toBe('aon');
    });
});
