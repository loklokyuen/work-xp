import React, { createContext, useState } from "react";

interface UserProviderProps {
    children: React.ReactNode;
}

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User|null>>;
}

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
