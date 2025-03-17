import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import styles from "@/app/styles";
import BookingCard from "@/components/BookingCard";
import { useEffect, useState } from "react";
import { getAcceptedApplicationsByBusinessId } from "@/database/applications";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useUserContext } from "@/context/UserContext";

export default function ManageBooking() {
  const navigation = useNavigation();
  const { user } = useUserContext();

  const [bookings, setBookings] = useState<Application[]>([]);
  useEffect(() => {
    if (!user) return;
    getAcceptedApplicationsByBusinessId(user.uid).then((res) => {
      setBookings(res);
    });
  }, []);
  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: "Bookings",
    });
  }, [navigation]);
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Manage Bookings
        </Text>
        {bookings.length === 0 && <Text variant="bodyMedium" style={{ padding: 20, textAlign: "center" }}>
            No booking yet
        </Text>}
        {bookings.map((booking) => {
          return (
            <BookingCard
              key={booking.uid}
              studentId={booking.studentId}
              oppId={booking.oppId}
              businessId={user?.uid || ''}
              dates={booking.datesApplied}
              photoUrl={booking.photoUrl}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
