import { vi } from 'vitest';

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({}))
}));

vi.mock('firebase/auth', () => {
    const signInWithEmailAndPassword = vi.fn();
    const signOut = vi.fn();
    const getAuth = vi.fn(() => ({}));
    const onAuthStateChanged = vi.fn((_auth: unknown, next?: (user: null) => void) => {
        if (typeof next === 'function') {
            queueMicrotask(() => next(null));
        }
        return () => {};
    });
    return { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut };
});
