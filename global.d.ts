declare global {
    interface User {
        uid: string;
        displayName: string;
        email: string;
        photoUrl: string;
        accountType: string;
    }
    interface accountProps {
        setAccount: React.Dispatch<React.SetStateAction<boolean>>;
    }
}

export {};
