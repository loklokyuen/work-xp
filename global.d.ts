declare global {
    interface User {
        uid: string;
        displayName: string;
        email: string;
        photoUrl: string;
    }
    interface accountProps {
        accountType: string;
        setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
        setAccountType: React.Dispatch<React.SetStateAction<string>>;
    }
    interface OpportunityCardProps {
        availability: string[];
        description: string;
        jobRole: string;
        id: string;
    }
}

export {};
