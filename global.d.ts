declare global {
    interface User {
        uid: string;
        displayName: string;
        email: string;
        photoUrl: string;
    }
    interface accountProps {
        setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
        setIsExistingUser: React.Dispatch<React.SetStateAction<boolean>>;
    }

    type AccountType = "Student" | "Business" | "Guest" | null;

    interface Business {
        uid: string;
        displayName: string;
        sector: string;
        photoUrl: string;
        email: string;
        address: string;
        county: string;
        description: string;
        phoneNumber: string;
        opportunities: Opportunity[];
        reviews: Review[];
        applications: Application[];
    }
    interface Opportunity {
        id: string;
        businessId: string;
        businessName: string;
        description: string;
        jobRole: string;
        subjects: string[];
    }
    interface Review {
        review: string;
        stars: number;
        studentName: string;
       
    }
    interface Student {
        uid: string;
        displayName: string;
        photoUrl: string;
        email: string;
        county: string;
        personalStatement: string;
        applications: Application[];
        reviews: Review[];
        subjects: string[];
        experience: string;
    }
    interface Experience {
        id: string;
        role: string;
        employer: string;
        startDate: string;
        endDate: string;
        description: string;
    }

    interface Application {
        uid:string,
        oppId: string,
        businessId:string,
        datesApplied: Record<string, any>,
        studentId: string,
        whyApply: string,
        whySuitable: string,
        personalStatement: string,
        experience: string,
        subjects: string[],
        displayName: string,
        photoUrl: string,
        isAccepted: boolean,
        businessName: string,
        reviewPosted:boolean
    }

    interface Chatroom {
        id: string;
        participants: string[];
        lastMessage: string;
        lastMessageTime: Date;
        readStatus: Record<string, boolean>;
        status: string;
    }
    interface Message {
        id: string;
        sender: string;
        content: string;
        timestamp: string;
    }
    type ChatStatus = "active" | "blocked" | "blocked and reported" | "not found";

}
export {};
