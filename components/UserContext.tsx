import React, { createContext, useState } from "react";

type UserProviderProps = {
    children: React.ReactNode;
};

type UserContext = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

type User = {
    uid: string | null;
    displayName: string | null;
    email: string | null;
    photoUrl: string | null;
};

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
