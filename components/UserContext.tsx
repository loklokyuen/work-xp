import React, { createContext, useState } from "react";

interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContext {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User>({ uid: "", displayName: "", email: "", photoUrl: "" });

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
