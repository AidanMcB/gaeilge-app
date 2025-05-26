import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type UserCredential } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { handleApiError, handleExternalApiError } from "@/utils/helper";
import type { AxiosError } from "axios";
import httpClient from "./httpClient";

export async function _logIn(email: string, password: string): Promise<UserCredential> {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        const token = await user.getIdToken();
        localStorage.setItem('gaeilgeAuthToken', token)
        return userCredentials;
    } catch (error) {
        console.error('Unable to login. Error: ', error);
        throw handleExternalApiError(error)
    }
}

export async function _signUp(username: string, email: string, password: string): Promise<UserCredential> {
    try {
        // Create new user
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user's display name
        await updateProfile(userCredentials.user, {
            displayName: username
        });
        const user = userCredentials.user;
        const token = await user.getIdToken();
        localStorage.setItem('gaeilgeAuthToken', token)
        return userCredentials;
    } catch (error) {
        console.error('Unable to sign up. Error: ', error);
        throw handleExternalApiError(error);
    }
}

export async function _logOut(): Promise<void> {
    try {
        await signOut(auth);
        localStorage.removeItem('gaeilgeAuthToken');
        return
    } catch (error) {
        console.error("Failed to log out. Error: ", error);
        throw handleExternalApiError(error);
    }
}

export async function _verifyAuth(userAuthToken: string): Promise<boolean> {
    try {
        const response = await httpClient.post('/auth/verify', {}, { headers: { Authorization: `Bearer ${userAuthToken}` } });
        return response.data.authenticated;
    } catch (error) {
        console.error("Failed to verify user auth. Error: ", error);
        throw handleApiError(error as AxiosError);
    }
}
