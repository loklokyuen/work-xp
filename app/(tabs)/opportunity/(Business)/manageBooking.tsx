import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import styles from "@/app/styles";
import BookingCard from "@/components/BookingCard";
import { useEffect, useState } from "react";
import { getAcceptedApplicationsByBusinessId } from "@/database/applications";
import { useLocalSearchParams } from "expo-router";
import { useUserContext } from "@/context/UserContext";

export default function ManageBooking() {
    const { user } = useUserContext();

    const [bookings, setBookings] = useState<Application1[]>([]);
    useEffect(() => {
        getAcceptedApplicationsByBusinessId(user?.uid).then((res) => {
            setBookings(res);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                Manage Booking
            </Text>
            {bookings.map((booking) => {
                return <BookingCard key={booking.uid} studentId={booking.studentId} oppId={booking.oppId} businessId={user?.uid} />;
            })}
        </View>
    );
}
