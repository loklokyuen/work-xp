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
    interface Business {
        uid: string;
        displayName: string;
        sector: string;
        photoUrl: string;
        email: string;
        address: string;
        county: string;
        description: string;
        opportunities: Opportunity[];
        reviews: Review[];
        applications: Application[];
    }
    interface Opportunity {
        id: string;
        availability: string[];
        description: string;
        jobRole: string;
    }
    interface Review {
        rating: number;
        review: string;
        author: string; 
    }
    interface Student {
        uid: string;
        displayName: string;
        photoUrl: string;
        email: string;
        applications: Application[];
        reviews: Review[];
        subjects: string[];
        experience: Experience[];
        county: string;
        personalStatement: string;
    }
    interface Experience {
        role: string;
        employer: string;
        startDate: string;
        endDate: string;
        description: string;
    }
    interface Application {
        opportunityId: string;
        businessId: string;
        studentId: string;
        status: string;
        applicationMessage: string;
    }
}
export {};
