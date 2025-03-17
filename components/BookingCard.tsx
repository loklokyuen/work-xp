import styles from "@/app/styles";
import { getBusinessOpportunityById } from "@/database/business";
import { getStudentById } from "@/database/student";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";
import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
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
  const [confirmedDates, setConfirmedDates] = useState<Record<string, any>>({});
  const { colors } = useTheme();

  const markDates = (date: string, color: string) => {
    let markedDates: Record<string, any> = {};

    const [start, end] = date.split(":");
    let current = new Date(start);

    while (current <= new Date(end)) {
      let dateAsString = current.toISOString().split("T")[0];
      if (dates[dateAsString]) return;
      markedDates[dateAsString] = {
        color: colors.secondary,
        textColor: colors.tertiary,
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
    <>
      <Card
        style={{
          backgroundColor: colors.secondaryContainer,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Card.Content>
          <Image
            source={{ uri: photoUrl }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              color: colors.onSecondary,
              padding: 5,
              margin: 10,
              fontFamily: "Lato",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Booking Details
          </Text>
          <Text
            style={{
              color: colors.onSecondary,
              padding: 5,
              margin: 10,
              fontFamily: "Lato",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Student: {student?.displayName}
          </Text>
          <Text
            style={{
              color: colors.onSecondary,
              padding: 5,
              margin: 10,
              fontFamily: "Lato",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Opportunity: {opportunity?.jobRole}
          </Text>
          <View>
            <Calendar
              style={{
                borderWidth: 0,
                height: 400,
                backgroundColor: colors.tertiaryContainer,
              }}
              theme={{
                calendarBackground: colors.tertiaryContainer,
                textSectionTitleColor: colors.primary, // mon tues weds thurs
                todayTextColor: colors.quarternary,
                dayTextColor: colors.tertiary,
                textDisabledColor: "#dd99ee",
                textDayFontFamily: "Lato",
                textMonthFontFamily: "Lato",
                textDayHeaderFontFamily: "Lato",
                monthTextColor: colors.primary,
              }}
              markingType={"period"}
              markedDates={confirmedDates}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Move the button outside the card */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Button
          mode="contained-tonal"
          style={{ margin: 10 }}
          labelStyle={{ fontFamily: "Lato", color: colors.onPrimary }}
          buttonColor={colors.error}
          onPress={() => {
            setOpenCancel(true);
          }}
        >
          Cancel
        </Button>
      </View>

      <ConfirmActionModal
        open={openCancel}
        onClose={() => {
          setOpenCancel(false);
        }}
        title="Cancel booking?"
        onConfirmAction={handleCancel}
      />
    </>
  );
}
