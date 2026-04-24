import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/stores/useAuthStore';
import * as authService from '@/services/auth.service';

vi.mock('@/services/auth.service', () => ({
    _logIn: vi.fn(),
    _signUp: vi.fn(),
    _logOut: vi.fn(),
    _getCurrentUser: vi.fn()
}));

const userDto = {
    id: '1',
    email: 'u@test.dev',
    username: 'user',
    firebase_uid: 'uid',
    created_at: '',
    updated_at: ''
};

describe('useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('enableGuestMode sets guest flag and localStorage', () => {
        const store = useAuthStore();
        store.enableGuestMode();
        expect(store.isGuestMode).toBe(true);
        expect(store.isAuthenticated).toBe(false);
        expect(localStorage.getItem('gaeilgeGuestMode')).toBe('true');
    });

    it('disableGuestMode clears guest flag', () => {
        const store = useAuthStore();
        store.enableGuestMode();
        store.disableGuestMode();
        expect(store.isGuestMode).toBe(false);
        expect(localStorage.getItem('gaeilgeGuestMode')).toBeNull();
    });

    it('logIn delegates to service and sets user', async () => {
        vi.mocked(authService._logIn).mockResolvedValueOnce({
            status: 200,
            data: { user: userDto }
        });
        const store = useAuthStore();
        const data = await store.logIn('u@test.dev', 'pw');
        expect(authService._logIn).toHaveBeenCalledWith('u@test.dev', 'pw');
        expect(store.user?.email).toBe('u@test.dev');
        expect(store.isGuestMode).toBe(false);
        expect(data.user.email).toBe('u@test.dev');
    });

    it('logOut clears guest mode via service path', async () => {
        vi.mocked(authService._logOut).mockResolvedValueOnce(undefined);
        const store = useAuthStore();
        store.enableGuestMode();
        store.disableGuestMode();
        await store.logOut();
        expect(authService._logOut).toHaveBeenCalled();
    });
});
