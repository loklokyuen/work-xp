import { createContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Snackbar, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SnackbarContext = createContext({
    showSnackbar: (message: string, severity: string, duration: number) => {},
});

export function SnackbarProvider({ children }: {children: React.ReactNode}) {
    const insets = useSafeAreaInsets();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<string>("info");
    const [duration, setDuration] = useState(5000);
    const { colors } = useTheme();

    const showSnackbar = (message: string, severity: string, duration: number) => {
        setMessage(message);
        setSeverity(severity);
        setDuration(duration);
        setOpen(true);
    };
    
    const hideSnackbar = () => {
        setOpen(false);
    };
    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                icon="close"
                style={{ backgroundColor: severity === "error" ? colors.error :( severity === "success"? colors.secondary : colors.primary), marginBottom: insets.bottom + 60 }}
                visible={open}
                onDismiss={hideSnackbar}
                duration={duration}
            >
                <TouchableOpacity onPress={hideSnackbar}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: severity === "error" ? colors.onError :( severity === "success"? colors.onSecondary : colors.onPrimary), padding: 10, letterSpacing: 0.5, fontFamily: "Lato" }}>
                        {message}
                    </Text>
                </TouchableOpacity>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}