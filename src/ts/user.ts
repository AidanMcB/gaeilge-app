export interface User {
    created_at: string;
    email: string;
    firebase_uid: string;
    id: number;
    updated_at: string;
    username: string;
};

export interface UserProviderData {
    providerId: string;
    uid: string;
    displayName?: string;
    email: string;
    phoneNumber?: string;
    photoURL?: string;
};
