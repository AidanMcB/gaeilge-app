import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { INoteCard, NewNoteCardForm } from '@/ts/Notecard';

const get = vi.fn();
const post = vi.fn();
const put = vi.fn();
const del = vi.fn();

vi.mock('@/services/httpClient', () => ({
    default: {
        get,
        post,
        put,
        delete: del
    }
}));

describe('notecards.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('_getAllNoteCards returns data', async () => {
        const cards: INoteCard[] = [{ id: 1, englishPhrase: 'a', irishPhrase: 'b', categories: [] } as INoteCard];
        get.mockResolvedValueOnce({ data: cards });
        const { _getAllNoteCards } = await import('@/services/notecards.service');
        const result = await _getAllNoteCards();
        expect(get).toHaveBeenCalledWith('/notecards');
        expect(result).toEqual(cards);
    });

    it('_addNoteCard posts payload', async () => {
        const created = { id: 2, englishPhrase: 'x', irishPhrase: 'y', categories: [] } as INoteCard;
        post.mockResolvedValueOnce({ data: created });
        const payload: NewNoteCardForm = {
            englishPhrase: 'x',
            irishPhrase: 'y',
            categories: []
        } as NewNoteCardForm;
        const { _addNoteCard } = await import('@/services/notecards.service');
        const result = await _addNoteCard(payload);
        expect(post).toHaveBeenCalledWith('/notecards/create', payload);
        expect(result).toEqual(created);
    });

    it('_deleteNoteCard calls delete', async () => {
        del.mockResolvedValueOnce({ data: { ok: true } });
        const { _deleteNoteCard } = await import('@/services/notecards.service');
        await _deleteNoteCard(5);
        expect(del).toHaveBeenCalledWith('/notecards/5');
    });
});
