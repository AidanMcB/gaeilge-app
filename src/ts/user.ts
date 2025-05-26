export interface User {
    uid: string;
    email?: string;
    displayName?: string;
    providerData?: UserProviderData;
}

export interface UserProviderData {
    providerId: string;
    uid: string;
    displayName?: string;
    email: string;
    phoneNumber?: string;
    photoURL?: string;
}
