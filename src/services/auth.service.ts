import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { handleApiError, handleExternalApiError } from "@/utils/helper";
import type { AxiosError } from "axios";
import httpClient from "./httpClient";
import type { GetCurrentUserApiResponse, LoginApiResponse, SignUpApiResponse } from "./ts/Auth.service.types";

export async function _logIn(email: string, password: string): Promise<LoginApiResponse> { 
    try {
        // Sign in using Firebase client SDK
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        // Get the Firebase ID token from the logged-in user
        const idToken = await userCred.user.getIdToken();

        // Store token in localStorage for httpClient interceptor
        localStorage.setItem('gaeilgeAuthToken', idToken);

        // Send the ID token to your backend to set the secure session cookie
        const response = await httpClient.post<LoginApiResponse>(
            '/auth/users/login',
            { idToken },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('Login failed:', error);
        throw handleExternalApiError(error as AxiosError);
    }
}

export async function _signUp(username: string, email: string, password: string): Promise<SignUpApiResponse> { 
    try {
        await httpClient.post('/auth/users/create', {
            username, email, password
        }, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        });

        // Log user in with Firebase clientSDK
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        // Get Firebase ID token
        const idToken = await userCred.user.getIdToken();

        // Store token in localStorage for httpClient interceptor
        localStorage.setItem('gaeilgeAuthToken', idToken);

        // Send ID token to backend to set the secure cookie
        const signUpResp = await httpClient.post<SignUpApiResponse>('/auth/users/login', {
            idToken
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Signup and login successful');
        return signUpResp.data;

    } catch (error) {
        console.error('Unable to sign up. Error: ', error);
        throw handleExternalApiError(error as AxiosError);
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

export async function _getCurrentUser(): Promise<GetCurrentUserApiResponse> {
    try {
        const response = await httpClient.get('/auth/users/me', {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to get current user. Error: ', error);
        throw handleApiError(error as AxiosError);
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
