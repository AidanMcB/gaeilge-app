import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNoteCardStore } from '@/stores/useNotecardStore';
import type { INoteCard } from '@/ts/Notecard';
import { ModalType } from '@/ts/Constants';
import * as noteCardService from '@/services/notecards.service';

vi.mock('@/services/notecards.service', () => ({
    _getAllNoteCards: vi.fn(),
    _addNoteCard: vi.fn(),
    _deleteNoteCard: vi.fn(),
    _editNoteCard: vi.fn(),
    _removeCategoryFromNoteCard: vi.fn()
}));

const card = (id: number): INoteCard =>
    ({
        id,
        englishPhrase: `en-${id}`,
        irishPhrase: `ga-${id}`,
        categories: []
    }) as INoteCard;

describe('useNotecardStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('getNoteCards loads list', async () => {
        vi.mocked(noteCardService._getAllNoteCards).mockResolvedValueOnce([card(1), card(2)]);
        const store = useNoteCardStore();
        await store.getNoteCards();
        expect(store.notecards).toHaveLength(2);
    });

    it('textFilter narrows by phrase', async () => {
        vi.mocked(noteCardService._getAllNoteCards).mockResolvedValueOnce([
            card(1),
            { ...card(2), englishPhrase: 'other' } as INoteCard
        ]);
        const store = useNoteCardStore();
        await store.getNoteCards();
        store.textFilter('en-1');
        expect(store.notecards).toHaveLength(1);
        expect(store.notecards[0].id).toBe(1);
    });

    it('clearTextFilter restores full list', async () => {
        vi.mocked(noteCardService._getAllNoteCards).mockResolvedValueOnce([card(1), card(2)]);
        const store = useNoteCardStore();
        await store.getNoteCards();
        store.textFilter('nomatch');
        expect(store.notecards).toHaveLength(0);
        store.clearTextFilter();
        expect(store.notecards).toHaveLength(2);
    });

    it('addNewNoteCard appends', async () => {
        vi.mocked(noteCardService._getAllNoteCards).mockResolvedValueOnce([card(1)]);
        vi.mocked(noteCardService._addNoteCard).mockResolvedValueOnce(card(2));
        const store = useNoteCardStore();
        await store.getNoteCards();
        await store.addNewNoteCard({
            id: 2,
            englishPhrase: 'x',
            irishPhrase: 'y',
            categories: []
        } as never);
        expect(store.notecards.some((c) => c.id === 2)).toBe(true);
    });

    it('toggleEditMode flips flag', () => {
        const store = useNoteCardStore();
        expect(store.isEditAllMode).toBe(false);
        store.toggleEditMode();
        expect(store.isEditAllMode).toBe(true);
    });

    it('openAddEditModal sets create mode', () => {
        const store = useNoteCardStore();
        store.openAddEditModal('add');
        expect(store.modalType).toBe(ModalType.Create);
        expect(store.isModalVisible).toBe(true);
    });
});
