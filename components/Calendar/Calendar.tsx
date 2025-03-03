// import { firebase } from "./firebaseConfig"
import { Button, Text, View } from 'react-native';

import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import React, {useState} from 'react';
import Day from 'react-native-calendars/src/calendar/day';


type DayPressEvent = {
    dateString: string,
    day: number;
    month:number;
    year: number;
    timestamp:number;
    marked: boolean;
    workExperience: string
}


interface CalendarAppProps {
    currentAvailableDates: string[]
}

const CalendarApp: React.FC<CalendarAppProps> = ({ currentAvailableDates }) => {
  const [selected, setSelected] = useState<string>('');
  const [firstDay, setFirstDay]= useState<string>("")
  const [secondDay, setSecondDay]= useState<string>("")

 const customerDates2 = currentAvailableDates

  

  const setMarkedCustomerArray = () => {
    let marked:  Record<string, any> = {}

    customerDates2.forEach((datePair)=> {
        const startDate = datePair[0]
        const endDate = datePair[1]
        const workExperience =datePair[2]
        
        
        // let marked: Record<string, any> = {}
        marked[startDate] = {startingDay: true, color: 'green',textColor: 'white'}
        marked[endDate] = {endingDay: true, color: 'green',textColor: 'white'}

        let start = new Date(startDate)
        let end = new Date(endDate) 
        // console.log(start.toISOString().split("T")[0])

        let current = new Date(start)

        while(current<=end){
            let dateAsString = current.toISOString().split("T")[0]

            marked[dateAsString] = {color:"green", textColor: "white"}
            
            current.setDate(current.getDate()+1)

        }
  })

  
        return marked
    }
  
    const updateDays = () => {
    }
    updateDays()
  


  return (
    
  
    <Calendar
    style={{
        borderWidth: 1,
        borderColor: 'gray',
        height: 350,
      }}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: '#2d4150',
        textDisabledColor: '#dd99ee'
      }}
      markingType={'period'}
      markedDates={setMarkedCustomerArray()}

   
      onDayPress={(day:DayPressEvent)=> {
      
      }}

      
    />
  );
};

export default CalendarApp;