import {
  deleteApplicationsById,
  getApplications,
} from "@/database/applications";
import { Button, useTheme } from "react-native-paper";
import { useUserContext } from "@/context/UserContext";
import { deleteStudentById } from "@/database/student";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { useState } from "react";
import { deleteBusinessById } from "@/database/business";
import { getAuth, deleteUser } from "firebase/auth";
import { Redirect } from "expo-router";
import styles from "@/app/styles";
import { Modal, View } from "react-native";

export function DeleteAccountButton() {
  const { user, accountType, setUser, setAccountType } = useUserContext();
  const auth = getAuth();
  const userCurr = auth.currentUser;
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const { colors, fonts } = useTheme();

  if (!accountType) {
    return <Redirect href="/(auth)/main" />;
  }

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        setAccountType(null);
      })
      .catch((err) => {
        console.log(err)
      });
  };

  const handleDelete = async () => {
    if (accountType === "Student") {
      try {
        const res = await getApplications();
        res.map(async (application) => {
          if (application.studentId === user?.uid) {
            await deleteApplicationsById(application.uid);
          }
        });
        await deleteUser(userCurr);
        await deleteStudentById(user.uid);
        await handleLogout()
      } catch (err) {
        console.log(err);
      }
    } else if (accountType === "Business") {
      try {
        const res = await getApplications();
        res.map(async (application) => {
          if (application.businessId === user?.uid) {
            await deleteApplicationsById(application.uid);
          }
        });
        await deleteUser(userCurr);
        await deleteBusinessById(user.uid);
        await handleLogout()
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
       <View style={styles.delButtonContainer}>
      <Button 
      mode="contained-tonal" 
      style={{
        backgroundColor: colors.error,
        borderRadius: 8,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 15,
      }}
      labelStyle={{
        fontFamily: "Lato",
        fontSize: 16,
        fontWeight: "normal",
        color: colors.onError,
      }}
      onPress={() => setOpenDelete(true)}>
        Delete Account
      </Button>
      <ConfirmActionModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Are you sure?"
        onConfirmAction={handleDelete}
      />
      </View>
    </>
  );
}
