import { db } from "@/database/firebase";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    accountType: AccountType | null;
    setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;
}

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    useEffect(() => {
        const auth = getAuth();
        async function onAuthStateChanged(user: any) {
            try {
                setUser(user);
                const document = await getDoc(doc(db, "Users", user.uid));
                const data = document.data();
                setAccountType(data?.accountType);
            } catch (error) {
                console.error("Error during auth initialization:", error);
            } finally {
                setInitializing(false);
            }
        }
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);
    if (initializing)
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    return <UserContext.Provider value={{ user, setUser, accountType, setAccountType }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
