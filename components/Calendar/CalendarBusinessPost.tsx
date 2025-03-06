// import { firebase } from "./firebaseConfig"
import { Alert, Button, Text, View } from "react-native";

import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import React, { SetStateAction, useEffect, useState, Dispatch } from "react";
import Day from "react-native-calendars/src/calendar/day";
import { UserContext, useUserContext } from "../../context/UserContext";

import { db } from "../../database/firebase";
import {
  addDoc,
  getDocs,
  query,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

type DayPressEvent = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const calculateDate = (firstDate: string, SecondDate: string) => {
  let markedDates: Record<string, any> = {};

  markedDates[firstDate] = {
    startingDay: true,
    color: "green",
    textColor: "white",
  };
  markedDates[SecondDate] = {
    endingDay: true,
    color: "green",
    textColor: "white",
  };

  let start = new Date(firstDate);
  let end = new Date(SecondDate);

  let current = new Date(start);

  while (current <= end) {
    let dateAsString = current.toISOString().split("T")[0];

    markedDates[dateAsString] = { color: "green", textColor: "white" };

    current.setDate(current.getDate() + 1);
  }
};

interface BusinessCalendarPostProps {
  setAvailability: Dispatch<SetStateAction<string>>;
}

interface Opportunities {
  Availability: string;
}

const BusinessCalenderPost: React.FC<BusinessCalendarPostProps> = ({
  setAvailability,
}) => {
  const [firstDay, setFirstDay] = useState<string>("");
  const [secondDay, setSecondDay] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmedDates, setConfirmedDates] = useState<string[]>([]);
  const [formattedConfirmedDates, setFormattedConfirmedDates] = useState<any>(
    []
  );
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const fetchConfirmedDates = async () => {
      try {
        // const docRef = doc(db,"Business_Users", currentBusiness);
        const docRef = doc(db, "business", user.uid);

        const docSnap = await getDoc(docRef);

        let alreadyConfirmedDates: Record<string, any> = {};

        if (docSnap.exists()) {
          const data = docSnap.data();

          let opportunitiesDatesArray: string[] = [];

          const opportunitiesArray = data.Opportunities;

          opportunitiesArray.forEach((opp: Opportunities) => {
            opportunitiesDatesArray.push(opp["Availability"]);
          });

          console.log(opportunitiesDatesArray);
          // if(Array.isArray(data["Available dates"])) {
          // const confirmed = data["Available dates"]

          if (Array.isArray(opportunitiesDatesArray)) {
            const confirmed = opportunitiesDatesArray;
            const splitArray = confirmed.map((datePair: string) => {
              return datePair.split(":");
            });
            splitArray.forEach((datePair) => {
              let firstDate = datePair[0];
              let secondDate = datePair[1];

              alreadyConfirmedDates[firstDate] = {
                startingDay: true,
                color: "red",
                textColor: "white",
              };
              alreadyConfirmedDates[secondDate] = {
                endingDay: true,
                color: "red",
                textColor: "white",
              };

              let start = new Date(firstDate);
              let end = new Date(secondDate);
              let current = new Date(start);

              while (current <= end) {
                let dateAsString = current.toISOString().split("T")[0];

                alreadyConfirmedDates[dateAsString] = {
                  color: "red",
                  textColor: "white",
                };

                current.setDate(current.getDate() + 1);
              }
            });
          }
        }
        setFormattedConfirmedDates(alreadyConfirmedDates);
        console.log(alreadyConfirmedDates);
        return alreadyConfirmedDates;
      } catch (err) {}
    };

    fetchConfirmedDates();
  }, []);

  const calculateDate = (firstDate: string, SecondDate: string) => {
    let marked: Record<string, any> = {};

    marked[firstDate] = {
      startingDay: true,
      color: "green",
      textColor: "white",
    };
    marked[SecondDate] = {
      endingDay: true,
      color: "green",
      textColor: "white",
    };

    let start = new Date(firstDate);
    let end = new Date(SecondDate);

    let current = new Date(start);

    while (current <= end) {
      let dateAsString = current.toISOString().split("T")[0];

      marked[dateAsString] = { color: "green", textColor: "white" };

      current.setDate(current.getDate() + 1);
    }

    return marked;
  };

  const handleConfirm = (startDate: string, endDate: string) => {
    setAvailability(`${startDate}:${endDate}`);
  };

  return (
    <>
      <Calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
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
        markedDates={{
          ...calculateDate(firstDay, secondDay),
          ...formattedConfirmedDates,
        }}
        onDayPress={(day: DayPressEvent) => {
          if (!firstDay) {
            setFirstDay(day.dateString);
            console.log("first day:", firstDay);
          } else if (!secondDay) {
            setSecondDay(day.dateString);
            console.log("second day:", secondDay);
            setShowConfirm(true);
          } else {
            setFirstDay(day.dateString);
            setSecondDay("");
            setShowConfirm(false);
          }
        }}
      />
      <Text>First day:{firstDay}</Text>
      <Text>Second day:{secondDay}</Text>
      {showConfirm && (
        <View>
          <Button
            title="Confirm Dates Available"
            onPress={() => {
              console.log(firstDay, secondDay);
              // handleConfirm(currentBusiness,firstDay, secondDay)
              handleConfirm(firstDay, secondDay);
            }}
          />
          <Button
            title="Clear Selection"
            onPress={() => {
              setFirstDay("");
              setSecondDay("");
              setShowConfirm(false);
            }}
          />
        </View>
      )}
    </>
  );
};

export default BusinessCalenderPost;
