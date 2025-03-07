import styles from "@/app/styles";
import { getAvailabilitiesByOpportunity, getBusinessOpportunityById } from "@/database/business";
import { getStudentById } from "@/database/student";
import { useEffect, useState } from "react";
import { Button, Card, Text } from "react-native-paper";

interface BookingCardProps {
    studentId: string;
    businessId: string;
    oppId: string;
}
export default function BookingCard({ studentId, businessId, oppId }: BookingCardProps) {
    const [student, setStudent] = useState<Student>();
    const [opportunity, setOpportunity] = useState<Opportunity>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    useEffect(() => {
        getStudentById(studentId).then((res) => {
            setStudent(res);
        });
        getBusinessOpportunityById(businessId, oppId).then((res) => {   
            console.log("opp: ", res);
                  
            setOpportunity(res);
        });

    }, []);
    return <Card style={styles.card}>
        <Card.Content>
            <Text variant="titleMedium" style={styles.modalText}>Booking Details</Text>
            <Text variant="bodyMedium" style={{ margin: 10 }}>Student: {student?.displayName}</Text>
            <Text variant="bodyMedium" style={{ margin: 10 }}>Opportunity: {opportunity?.jobRole}</Text>
            <Text variant="bodyMedium" style={{ margin: 10 }}>Date: {startDate} - {endDate}</Text>
            <Button mode="contained-tonal"  style={{ margin: 10 }} onPress={() => { console.log("pressed"); }}>Cancel</Button>
        </Card.Content>
    </Card>
}