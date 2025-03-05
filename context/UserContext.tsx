import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Text } from "react-native";

interface UserProviderProps {
    children: React.ReactNode;
}

async function getUserAccountType() {
    try {
        const value = await AsyncStorage.getItem('accountType')
        if (value) {
            return value
        }
    } catch (e) {
        console.log(e)
    }
}

export async function setUserAccountType(value: string) {
    try {
        if (value){
            await AsyncStorage.setItem('accountType', value)
        }
    } catch (e) {
        console.log(e)
    }
}

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User|null>>;
    accountType: AccountType | null;
    setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;
}

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    useEffect(() => {
        const auth = getAuth();
        function onAuthStateChanged(user: any) {
            setUser(user); 
        }
        getUserAccountType().then((value) => {
            if (value) {
                setAccountType(value as AccountType);
            }
        });
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);
    return <UserContext.Provider value={{ user, setUser, accountType, setAccountType }}>
        {children}</UserContext.Provider>;
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
