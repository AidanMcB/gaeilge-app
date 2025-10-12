import type { User } from '@/ts/user';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as authService from '@/services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { getFirebaseErrorMessage } from '@/ts/Auth';
import type { FirebaseError } from 'firebase/app';
import type { AuthApiResponseBody } from '@/services/ts/Auth.service.types';

export const useAuthStore = defineStore("useAuthStore", () => {
    const user = ref<User>();
    const isAuthenticated = ref<boolean>(false);
    const loadingAuth = ref<boolean>(true);
    const isGuestMode = ref<boolean>(false);

    // Initialize guest mode from localStorage
    const savedGuestMode = localStorage.getItem('gaeilgeGuestMode');
    if (savedGuestMode === 'true') {
        isGuestMode.value = true;
        loadingAuth.value = false;
    }

    // Initialize auth state listener
    listenForAuthChanges();

    async function logIn(email: string, password: string): Promise<AuthApiResponseBody> {
        try {
            const resp = await authService._logIn(email, password);
            user.value = resp.data.user;
            // Clear guest mode when logging in
            isGuestMode.value = false;
            localStorage.removeItem('gaeilgeGuestMode');
            return resp.data;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    async function signUp(username: string, email: string, password: string): Promise<AuthApiResponseBody> {
        try {
            const resp = await authService._signUp(username, email, password);
            user.value = resp.data.user;
            // Clear guest mode when signing up
            isGuestMode.value = false;
            localStorage.removeItem('gaeilgeGuestMode');
            return resp.data;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    async function logOut(): Promise<void | any> {
        try {
            const resp = await authService._logOut();
            user.value = undefined;
            isGuestMode.value = false;
            return resp;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    function enableGuestMode(): void {
        isGuestMode.value = true;
        isAuthenticated.value = false;
        user.value = undefined;
        loadingAuth.value = false;
        localStorage.setItem('gaeilgeGuestMode', 'true');
    }

    function disableGuestMode(): void {
        isGuestMode.value = false;
        localStorage.removeItem('gaeilgeGuestMode');
    }

    async function getCurrentUser(): Promise<User | undefined> {
        try {
            const resp = await authService._getCurrentUser();
            if (resp.data.user) {
                user.value = resp.data.user;
                isAuthenticated.value = true;
            }
            loadingAuth.value = false;
            return resp.data.user;
        } catch (error) {
            console.error("Failed to get current user. Error: ", error);
            loadingAuth.value = false;
            isAuthenticated.value = false;
            user.value = undefined;
            throw getFirebaseErrorMessage(error as FirebaseError);
        }
    }

    function listenForAuthChanges(): () => void {
        // Don't start auth listener if in guest mode
        if (isGuestMode.value) {
            return () => {};
        }

        loadingAuth.value = true;

        const unsubscribe = onAuthStateChanged(auth, 
            async (firebaseUser) => {
                // Don't process auth changes if in guest mode
                if (isGuestMode.value) {
                    return;
                }

                if (firebaseUser) {
                    // User is signed in - get user data from backend
                    try {
                        const idToken = await firebaseUser.getIdToken();
                        localStorage.setItem('gaeilgeAuthToken', idToken);
                        
                        // Try to get user data from backend, but don't fail if it doesn't work
                        try {
                            const userData = await authService._getCurrentUser();
                            user.value = userData.data.user;
                        } catch (backendError) {
                            console.warn('Backend user data not available, using Firebase user data:', backendError);
                            // Fallback to Firebase user data
                            user.value = {
                                id: firebaseUser.uid,
                                email: firebaseUser.email || '',
                                username: firebaseUser.displayName || firebaseUser.email || 'User',
                                firebase_uid: firebaseUser.uid,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            };
                        }
                        isAuthenticated.value = true;
                    } catch (error) {
                        console.error('Failed to get user data:', error);
                        user.value = undefined;
                        isAuthenticated.value = false;
                    }
                } else {
                    // User is signed out
                    user.value = undefined;
                    isAuthenticated.value = false;
                    localStorage.removeItem('gaeilgeAuthToken');
                }
                loadingAuth.value = false;
            },
            (error) => {
                console.error('Auth state change error:', error);
                loadingAuth.value = false;
                isAuthenticated.value = false;
                user.value = undefined;
            }
        );

        return unsubscribe;
    }

    async function verifyUser(): Promise<boolean> {
        const auth = getAuth();

        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    console.log("No authenticated user found.");
                    resolve(false);
                    return;
                }

                try {
                    const userAuthToken = await user.getIdToken();
                    const resp = await authService._verifyAuth(userAuthToken);
                    resolve(resp);
                } catch (error) {
                    console.error("Failed to check user auth. Error:", error);
                    resolve(false);
                }
            });
        });
    }

    return {
        user,
        isAuthenticated,
        loadingAuth,
        isGuestMode,
        logIn,
        signUp,
        logOut,
        enableGuestMode,
        disableGuestMode,
        listenForAuthChanges,
        verifyUser
    }

})
