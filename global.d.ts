declare global {
    interface User {
        uid: string;
        displayName: string;
        email: string;
        photoUrl: string;
    }
    interface accountProps {
        setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
    }
    type AccountType = "Student" | "Business" | "Guest" | null;
    interface OpportunityCardProps {
        availability: string[];
        description: string;
        jobRole: string;
        id: string;
    }
}

export {};
