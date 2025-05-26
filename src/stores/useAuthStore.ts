import type { User } from '@/ts/User';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as authService from '@/services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { getFirebaseErrorMessage } from '@/ts/Auth';
import type { FirebaseError } from 'firebase/app';

export const useAuthStore = defineStore("useAuthStore", () => {
    const user = ref<User>();
    const isAuthenticated = ref<boolean>();
    const loadingAuth = ref<boolean>(true);

    async function logIn(email: string, password: string): Promise<void | any> {
        try {
            const resp = await authService._logIn(email, password);
            return resp;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    async function signUp(username: string, email: string, password: string): Promise<void | any> {
        try {
            const resp = await authService._signUp(username, email, password);
            return resp;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    async function logOut(): Promise<void | any> {
        try {
            const resp = await authService._logOut();
            user.value = undefined;
            return resp;
        } catch (error) {
            console.error("Failed to log in user. Error: ", error);
            throw getFirebaseErrorMessage(error as FirebaseError)
        }
    }

    async function listenForAuthChanges(): Promise<() => void> {
        loadingAuth.value = true;
        
        const unsubscribe = onAuthStateChanged(auth, 
            (firebaseUser) => {
                if (firebaseUser) {
                    // User is signed in
                    const providerData = firebaseUser.providerData[0];
                    user.value = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || undefined,
                        displayName: firebaseUser.displayName || undefined,
                        providerData: providerData ? {
                            providerId: providerData.providerId,
                            uid: providerData.uid,
                            displayName: providerData.displayName || undefined,
                            email: providerData.email || '',
                            phoneNumber: providerData.phoneNumber || undefined,
                            photoURL: providerData.photoURL || undefined
                        } : undefined
                    };
                    isAuthenticated.value = true;
                } else {
                    // User is signed out
                    user.value = undefined;
                    isAuthenticated.value = false;
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
        logIn,
        signUp,
        logOut,
        listenForAuthChanges,
        verifyUser
    }

})
