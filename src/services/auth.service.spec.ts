import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as firebaseAuth from 'firebase/auth';

vi.mock('@/services/httpClient', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}));

describe('auth.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('_logIn stores token and returns login payload', async () => {
        const httpClient = (await import('@/services/httpClient')).default;
        vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValueOnce({
            user: { getIdToken: async () => 'fake-id-token' }
        } as never);
        vi.mocked(httpClient.post).mockResolvedValueOnce({
            data: {
                status: 200,
                data: {
                    user: {
                        id: '1',
                        email: 'a@b.c',
                        username: 'u',
                        firebase_uid: 'x',
                        created_at: '',
                        updated_at: ''
                    }
                }
            }
        } as never);

        const { _logIn } = await import('@/services/auth.service');
        const result = await _logIn('a@b.c', 'secret');
        expect(localStorage.getItem('gaeilgeAuthToken')).toBe('fake-id-token');
        expect(httpClient.post).toHaveBeenCalledWith(
            '/auth/users/login',
            { idToken: 'fake-id-token' },
            expect.any(Object)
        );
        expect(result.data.user.email).toBe('a@b.c');
    });

    it('_logOut clears token', async () => {
        localStorage.setItem('gaeilgeAuthToken', 'x');
        vi.mocked(firebaseAuth.signOut).mockResolvedValueOnce(undefined as never);
        const { _logOut } = await import('@/services/auth.service');
        await _logOut();
        expect(firebaseAuth.signOut).toHaveBeenCalled();
        expect(localStorage.getItem('gaeilgeAuthToken')).toBeNull();
    });

    it('_getCurrentUser proxies GET /auth/users/me', async () => {
        const httpClient = (await import('@/services/httpClient')).default;
        vi.mocked(httpClient.get).mockResolvedValueOnce({
            data: {
                status: 200,
                data: {
                    user: {
                        id: '1',
                        email: 'x@y.z',
                        username: 'u',
                        firebase_uid: 'f',
                        created_at: '',
                        updated_at: ''
                    }
                }
            }
        } as never);
        const { _getCurrentUser } = await import('@/services/auth.service');
        const resp = await _getCurrentUser();
        expect(httpClient.get).toHaveBeenCalledWith('/auth/users/me', { withCredentials: true });
        expect(resp.data.user.email).toBe('x@y.z');
    });
});
