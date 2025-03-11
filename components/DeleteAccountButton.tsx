import {
  deleteApplicationsById,
  getApplications,
} from "@/database/applications";
import { Button } from "react-native-paper";
import { useUserContext } from "@/context/UserContext";
import { deleteStudentById } from "@/database/student";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { useState } from "react";
import { deleteBusinessById } from "@/database/business";
import { getAuth, deleteUser } from "firebase/auth";

export function DeleteAccountButton() {
  const { user, accountType } = useUserContext();
  const auth = getAuth();
  const userCurr = auth.currentUser;
  const [openDelete, setOpenDelete] = useState<boolean>(false);

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
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Button mode="contained-tonal" onPress={() => setOpenDelete(true)}>
        Delete Account
      </Button>
      <ConfirmActionModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Are you sure?"
        onConfirmAction={handleDelete}
      />
    </>
  );
}
