declare global {
    interface User {
        uid: string;
        displayName: string;
        email: string;
        photoUrl: string;
        accountType: string;
    }
}

export {};
