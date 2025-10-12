import type { FirebaseError } from "firebase/app";

export enum FirebaseErrorCode {
    InvalidEmail = "auth/invalid-credential",
    UserNotFound = "auth/user-not-found",
    WrongPassword = "auth/wrong-password",
    EmailAlreadyInUse = "auth/email-already-in-use",
    WeakPassword = "auth/weak-password",
    TooManyRequests = "auth/too-many-requests",
}

export type FirebaseErrorMessages = {
    [key in FirebaseErrorCode]?: string;
};

export const firebaseErrorCodeToMessage: FirebaseErrorMessages= {
    [FirebaseErrorCode.InvalidEmail]: "Invalid email address",
    [FirebaseErrorCode.UserNotFound]: "Could not find a user with this email address",
    [FirebaseErrorCode.WrongPassword]: "Invalid password",
    [FirebaseErrorCode.EmailAlreadyInUse]: "This email is already in use",
    [FirebaseErrorCode.WeakPassword]: "Password too weak, please try something else",
    [FirebaseErrorCode.TooManyRequests]: "Too many failed requests, please try again later"
}

export const getFirebaseErrorMessage = (errorCode: FirebaseError): string => {
    const mappedMessage = firebaseErrorCodeToMessage[errorCode.message as FirebaseErrorCode];
    return mappedMessage || "An unknown error occurred.";
};