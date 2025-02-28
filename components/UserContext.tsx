import React, { createContext, useState } from "react";

type UserProviderProps = {
    children: React.ReactNode;
};

type UserContext = {
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<string>("grumpy19");

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
