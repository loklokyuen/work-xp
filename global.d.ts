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
        availability: string[];
        description: string;
        jobRole: string;
    }
    interface Review {
        id: string;
        businessId: string;
        studentId: string;
        rating: number;
        review: string;
        displayName: string;
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
        id: string;
        opportunityId: string;
        businessId: string;
        studentId: string;
        status: string;
        applicationMessage: string;
    }

    interface Application1 {

        uid:string,
        oppId: string,
        businessId:string,
  datesApplied: Record<string, any>,
  studentId: string,
  whyApply: string,
  whySuitable: string,
  personalStatement: string,
  experience: string,
  subjects: string
    }

    type StudentProps = {
        studentInfo: Student;
    } 
    type BusinessProps = {
        businessInfo: Business;
    }
}
export {};
