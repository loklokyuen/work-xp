// import { firebase } from "./firebaseConfig"
import { Alert, Button, Text, View } from 'react-native';

import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import React, {useEffect, useState} from 'react';
import Day from 'react-native-calendars/src/calendar/day';

import { db } from "./firebaseConfig"
import { addDoc,getDocs, query, collection, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

type DayPressEvent = {
    dateString: string,
    day: number;
    month:number;
    year: number;
    timestamp:number;
   
}

const calculateDate = (firstDate: string,SecondDate: string) => {
  let marked:  Record<string, any> = {}

      
      marked[firstDate] = {startingDay: true, color: 'green',textColor: 'white'}
      marked[SecondDate] = {endingDay: true, color: 'green',textColor: 'white'}

      let start = new Date(firstDate)
      let end = new Date(SecondDate) 
    

      let current = new Date(start)

      while(current<=end){
          let dateAsString = current.toISOString().split("T")[0]

          marked[dateAsString] = {color:"green", textColor: "white"}
          
          current.setDate(current.getDate()+1)

      }


      return marked
  }




const BusinessCalender = ({currentBusiness}: {currentBusiness:string}) => {

  const [firstDay, setFirstDay]= useState<string>("")
  const [secondDay, setSecondDay]= useState<string>("")
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [confirmedDates, setConfirmedDates] = useState <string[]>([])
  const [formattedConfirmedDates, setFormattedConfirmedDates] = useState<any[][]>([])


  // const handleConfirm = (currentBusiness: string, startDate:string, endDate:string) => {

  //   const addDateToBusiness = async (currentBusiness: string, startDate:string, endDate:string) => {
  //     try {
  //       const docRef = doc(db,"Business_Users", currentBusiness)

  //       await updateDoc(docRef,{
  //        ["Available dates"]: `${startDate}:${endDate}`
  //       })
  //       console.log("succesfully written")
  //     }catch(err){
  //       console.error("Error adding to database", err)
  //     }
  //   }

  //   addDateToBusiness

  // }

  // const handleConfirm = async (currentBusiness: string, startDate: string, endDate: string) => {
  //   try {
  //     const docRef = doc(db, 'Business_Users', currentBusiness);

     
  //     await updateDoc(docRef, {
  //       ["Available dates"]: [`${startDate}:${endDate}`],
  //     });

  //     console.log('Successfully written to Firestore');
  //   } catch (err) {
  //     console.error('Error adding to database', err);
  //   }
  // };



//   useEffect(()=> {
//  const fetchConfirmedDates = async () => {
//   console.log("Hello")
//     try {
//       const docRef = doc(db,"Business_Users", currentBusiness);

//       const docSnap = await getDoc(docRef)

//       if(docSnap.exists()) {
//         const data = docSnap.data()
//         if(Array.isArray(data["Available dates"])) {
//               const confirmed = data["Available dates"]
//               console.log(confirmed)
//               setConfirmedDates(confirmed)
              
//       }
//     }  
//     }catch(err) {
//       console.log(err)
//   }
// }

// fetchConfirmedDates()
//   },[currentBusiness])

//  const calculateConfirmedMarked = (array:string[]) => {
//    const splitArray = array.map((datePair:string)=> {
//     return [datePair.split(":")[0], datePair.split(":")[1]]
//   })
//   const firstDate = splitArray[0]
//   const secondDate = splitArray[1]
//   return [firstDate, secondDate]
// }
// console.log(calculateConfirmedMarked(confirmedDates))

// const markConfirmedMarked = (dateArray: any[]) => {
  
//   const confirmedDates1 = calculateConfirmedMarked(confirmedDates)
//   let marked:  Record<string, any> = {}


//   confirmedDates1.forEach((datePair) => {
//     const firstDate = datePair[0]
//     const secondDate = datePair[1]
    
//     marked[firstDate] = {startingDay: true, color: 'red',textColor: 'white'}
//     marked[secondDate] = {endingDay: true, color: 'red',textColor: 'white'}



//     let start = new Date(firstDate)
//     let end = new Date(secondDate) 
  

//     let current = new Date(start)

//     while(current<=end){
//         let dateAsString = current.toISOString().split("T")[0]

//         marked[dateAsString] = {color:"red", textColor: "white"}
        
//         current.setDate(current.getDate()+1)

//     }



//     return marked


//   })
// }


  const calculateDate = (firstDate: string,SecondDate: string) => {
    let marked:  Record<string, any> = {}
  
        
        marked[firstDate] = {startingDay: true, color: 'green',textColor: 'white'}
        marked[SecondDate] = {endingDay: true, color: 'green',textColor: 'white'}
  
        let start = new Date(firstDate)
        let end = new Date(SecondDate) 
      
  
        let current = new Date(start)
  
        while(current<=end){
            let dateAsString = current.toISOString().split("T")[0]
  
            marked[dateAsString] = {color:"green", textColor: "white"}
            
            current.setDate(current.getDate()+1)
  
        }
  
  
        return marked
    }
 

    const handleConfirm = async (currentBusiness:string, startDate:string, endDate:string) => {
      try {
        const docRef = doc(db, "Business_Users", currentBusiness);
  
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          if (!Array.isArray(data["Available dates"])) {
            await updateDoc(docRef, {
              ["Available dates"]: [`${startDate}:${endDate}`],
            });
          } else {
            await updateDoc(docRef, {
              ["Available dates"]: arrayUnion(`${startDate}:${endDate}`),
            });
          }
        }
  
        console.log("Successfully written to Firestore");
      } catch (err) {
        console.error("Error adding to database", err);
      }
    };

  

  return (
    
  <>
  
  
  
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
     markedDates={calculateDate(firstDay,secondDay)}
    // markedDates = {markConfirmedMarked(confirmedDates)}
    
    onDayPress={(day:DayPressEvent)=> {
     
     if(!firstDay){
        setFirstDay(day.dateString)
        console.log("first day:", firstDay)
      } else if(!secondDay){
        setSecondDay(day.dateString)
        console.log("second day:", secondDay)
        setShowConfirm(true)

      } else {
        setFirstDay(day.dateString)
        setSecondDay("")
        setShowConfirm(false)

      }
      
    }}
    
    />
    <Text>First day:{firstDay}</Text>
    <Text>Second day:{secondDay}</Text>
    {showConfirm && (
    <View>
  <Button title="Confirm Dates Available" onPress={()=> {
        console.log(firstDay, secondDay)
        handleConfirm(currentBusiness,firstDay, secondDay)
      }}/>
      <Button title="Clear Selection" onPress={()=> {
        setFirstDay("")
        setSecondDay("")
        setShowConfirm(false)
      }}/>

    </View>
    
     
    )}
    
    </>
  );


}



  
export default BusinessCalender