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
//  console.log(customerDates2)

  const customerDates1 = {
    dates:[["2025-02-03", "2025-02-07","mechanic workshop"], ["2025-02-17","2025-02-21","receptionist"], ["2025-03-03","2025-03-07", "mechanic workshop"]]
  }

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
//   console.log(marked)
  
        return marked
    }
  
    const updateDays = () => {
    }
    updateDays()
  

    // const customerDates = {
    //     startDate: "2025-02-13",
    //     endDate: "2025-02-17",
    // }

    // const setMarkedCustomerDates = () => {
    //     let marked: Record<string, any> = {}
    //     marked[customerDates.startDate] = {startingDay: true, color: 'green',textColor: 'white'}
    //     marked[customerDates.endDate] = {endingDay: true, color: 'green',textColor: 'white'}

    //     let start = new Date(customerDates.startDate)
    //     let end = new Date(customerDates.endDate)
    //     console.log(start.toISOString().split("T")[0])

    //     let current = new Date(start)

    //     while(current<=end){
    //         let dateAsString = current.toISOString().split("T")[0]

    //         marked[dateAsString] = {color:"green", textColor: "white"}
            
    //         current.setDate(current.getDate()+1)

    //     }

    //     return marked
    // }

    // const getMarkedDates = () => {
    //     let marked: Record<string, any> = {}

    //     if(firstDay){
    //         marked[firstDay] = {startingDay: true, color: 'green',textColor: 'white'}
    //     }
    //     if(secondDay){
    //         marked[secondDay]= {endingDay: true, color: 'green',textColor: 'white'}
    //     }

    //     return marked
    // }

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
   
    //   onDayPress={(day:DayPressEvent)=> {
        
    //     setSelected(day.dateString);

    //      console.log(`${day.year}-${day.month}-${day.day}`)

    //      if(!firstDay){
    //         setFirstDay(selected)
    //      } else if(!secondDay){
    //         setSecondDay(selected)
    //      } else if(firstDay&&secondDay){
    //         setFirstDay("")
    //         setSecondDay("")
    //         console.log("reset")
    //      }

    //     console.log(firstDay, secondDay)
       
       
    //   }}
      
    />
  );
};

export default CalendarApp;