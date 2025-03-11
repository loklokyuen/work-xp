import { useUserContext } from '@/context/UserContext';
import { generateChatId, getChatRooms, sendFirstMessage } from '@/database/chat';
import { getAllBusinessUsers, getAllStudentUsers } from '@/database/user';
import { ChatFirstMessageModal } from '@/modal/ChatFirstMessageModal';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Searchbar, SegmentedButtons, Text } from 'react-native-paper';

const NewChat: React.FC = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const { user, accountType} = useUserContext();
    const [allBusinessUsers, setAllBusinessUsers] = useState<User[]>([]);
    const [allStudentUsers, setAllStudentUsers] = useState<User[]>([]);
    const [businessUsers, setBusinessUsers] = useState<User[]>([]);
    const [studentUsers, setStudentUsers] = useState<User[]>([]);
    const [value, setValue] = useState<string>('Business');
    const [receiver, setReceiver] = useState<User>();
    const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUsersList = async () => {
        if (!user) return;
        const chatRooms = await getChatRooms(user.uid);
        const existingUsers = chatRooms
            .filter(chatRoom => chatRoom.participants.includes(user.uid))
            .map(chatRoom => {
                return chatRoom.participants.find(participant => participant !== user.uid);
            })
            .filter(Boolean) as string[];
            
        const businesses = await getAllBusinessUsers();
        const filteredBusinesses = businesses.filter((business) => !existingUsers.includes(business.uid));
        setAllBusinessUsers(filteredBusinesses);
        setBusinessUsers(filteredBusinesses);
        
        if (accountType === "Student") {
            const students = await getAllStudentUsers();
            const filteredStudents = students.filter((student) => !existingUsers.includes(student.uid));
            setAllStudentUsers(filteredStudents); 
            setStudentUsers(filteredStudents);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        navigation.setOptions({ 
            headerBackTitle: '',
            headerTitle: 'Start a New Chat'
        });
        refreshUsersList();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (value === "Business") {
            const filteredBusinesses = allBusinessUsers.filter((business) => 
                business.displayName.toLowerCase().includes(query.toLowerCase())
            );
            setBusinessUsers(filteredBusinesses);
        } else {
            const filteredStudents = allStudentUsers.filter((student) => 
                student.displayName.toLowerCase().includes(query.toLowerCase())
            );
            setStudentUsers(filteredStudents);
        }
    };

    if (loading) return <ActivityIndicator animating={true} />;

    return (
        <SafeAreaView style={styles.container}>
            { accountType === "Student" &&
            <SegmentedButtons style={{ width: '90%', margin: 10 }}
                value={value}
                onValueChange={setValue}
                buttons={[
                {
                    value: 'Business',
                    label: 'Business',
                    icon: 'briefcase',
                },
                { 
                    value: 'Student',
                    label: 'Student',
                    icon: 'book'
                }
                ]}
            />}
            <Searchbar
                style={{ width: '90%', margin: 10 }}
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchQuery}
                />
            {value === "Business" && businessUsers.length > 0 && (
                <ScrollView style={styles.usersListContainer}>
                    {businessUsers.map((business) => (
                    <TouchableOpacity style={styles.userContainer} key={business.uid} 
                    onPress={()=>{
                        setReceiver(business);
                        setChatModalOpen(true);
                    }}>
                        <Text key={business.uid}>{business.displayName}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            {value === "Student" && studentUsers.length > 0 && (
                <ScrollView style={styles.usersListContainer}>
                    {studentUsers.map((student) => (
                    <TouchableOpacity style={styles.userContainer} key={student.uid} 
                    onPress={()=>{
                        setReceiver(student);
                        setChatModalOpen(true);
                    }}>
                        <Text key={student.uid}>{student.displayName}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <ChatFirstMessageModal open={chatModalOpen} reciever={receiver?.displayName || 'the user'} onClose={()=>{setChatModalOpen(false)}} 
              onConfirmAction={async (content: string)=>{
                if (!user || !receiver) {return;}
                const isMessageSent = await sendFirstMessage(user.uid, receiver.uid, content);
                if (isMessageSent) {
                    const chatId = generateChatId(user.uid, receiver.uid);
                    router.navigate({ pathname: "/(chat)/chatroom", params: { chatRoomId: chatId, receiverAccountType: value, receiverUid: receiver.uid } });
                    refreshUsersList();
                } else {
                    alert("Error sending message");
                }
              }} />
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    userContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      backgroundColor: '#EADDFF',
      width: '100%',
    },
    usersListContainer: {
        flexGrow: 1,
        padding: 10,
        width: '90%',
    }
  });  

export default NewChat;