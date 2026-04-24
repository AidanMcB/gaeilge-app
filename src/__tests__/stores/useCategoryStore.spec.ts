import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCategoryStore } from '@/stores/useCategoryStore';
import * as categoryService from '@/services/category.service';

vi.mock('@/services/category.service', () => ({
    _getAllCategories: vi.fn(),
    _addNewCategory: vi.fn()
}));

describe('useCategoryStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('getCategories loads categories', async () => {
        vi.mocked(categoryService._getAllCategories).mockResolvedValueOnce([
            { id: 1, name: 'A' },
            { id: 2, name: 'B' }
        ]);
        const store = useCategoryStore();
        await store.getCategories();
        expect(store.categories).toHaveLength(2);
    });

    it('addNewCategory appends', async () => {
        vi.mocked(categoryService._getAllCategories).mockResolvedValueOnce([]);
        vi.mocked(categoryService._addNewCategory).mockResolvedValueOnce({ id: 3, name: 'New' });
        const store = useCategoryStore();
        await store.getCategories();
        await store.addNewCategory('New');
        expect(store.categories.some((c) => c.name === 'New')).toBe(true);
    });
});
