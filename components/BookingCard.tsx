import styles from "@/app/styles";
import {
  getAvailabilitiesByOpportunity,
  getBusinessOpportunityById,
} from "@/database/business";
import { getStudentById } from "@/database/student";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";

interface BookingCardProps {
  studentId: string;
  businessId: string;
  oppId: string;
  dates: Record<string, any>;
  photoUrl: string;
}
export default function BookingCard({
  studentId,
  businessId,
  oppId,
  dates,
  photoUrl,
}: BookingCardProps) {
  const [openCancel, setOpenCancel] = useState(false);
  const [student, setStudent] = useState<Student>();
  const [opportunity, setOpportunity] = useState<Opportunity>();
  // const [startDate, setStartDate] = useState<string>();
  // const [endDate, setEndDate] = useState<string>();
  const [confirmedDates, setConfirmedDates] = useState<Record<string, any>>({});

  const markDates = (date: string, color: string) => {
    let markedDates: Record<string, any> = {};

    const [start, end] = date.split(":");
    let current = new Date(start);

    while (current <= new Date(end)) {
      let dateAsString = current.toISOString().split("T")[0];
      if (dates[dateAsString]) return;
      markedDates[dateAsString] = {
        color: color,
        textColor: "white",
        startingDay: dateAsString === start,
        endingDay: dateAsString === end,
      };
      current.setDate(current.getDate() + 1);
    }
    setConfirmedDates((prevDates) => ({ ...prevDates, ...markedDates }));
  };

  useEffect(() => {
    getStudentById(studentId).then((res) => {
      setStudent(res);
    });
    getBusinessOpportunityById(businessId, oppId).then((res) => {
      setOpportunity(res);
    });
    dates.forEach((datePair: string) => {
      markDates(datePair, "green");
    });
  }, []);

  function handleCancel() {}
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Image
          source={{ uri: photoUrl }}
          style={{ width: 200, height: 200 }}
        ></Image>
        <Text variant="titleMedium" style={styles.modalText}>
          Booking Details
        </Text>
        <Text variant="bodyMedium" style={{ margin: 10 }}>
          Student: {student?.displayName}
        </Text>
        <Text variant="bodyMedium" style={{ margin: 10 }}>
          Opportunity: {opportunity?.jobRole}
        </Text>

        <Calendar
          style={{
            borderWidth: 1,
            borderColor: "gray",
            height: 400,
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#dd99ee",
          }}
          markingType={"period"}
          markedDates={confirmedDates}
          setJobRole
          // onDayPress={(day: DayPressEvent) => {
          //     handleDay(day.dateString);
          // }}
        />

        {/* <Text variant="bodyMedium" style={{ margin: 10 }}>Date: {startDate} - {endDate}</Text> */}
        <Button
          mode="contained-tonal"
          style={{ margin: 10 }}
          onPress={() => {
            setOpenCancel(true);
          }}
        >
          Cancel
        </Button>
        <ConfirmActionModal
          open={openCancel}
          onClose={() => {
            setOpenCancel(false);
          }}
          title="Confirm cancel booking?"
          onConfirmAction={handleCancel}
        />
      </Card.Content>
    </Card>
  );
}
