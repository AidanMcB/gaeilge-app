export interface User {
    uid: string;
    email: string;
    providerData: UserProviderData;
}

export interface UserProviderData {
    providerId: string;
    uid: string;
    displayName?: string;
    email: string;
    phoneNumber?: number;
    photoURL?: string;
    createdAt: string;
    lastLoginAt: string;
}
