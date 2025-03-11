import {
  deleteApplicationsById,
  getApplications,
} from "@/database/applications";
import { Button } from "react-native-paper";
import { setUserAccountType, useUserContext } from "@/context/UserContext";
import { deleteStudentById } from "@/database/student";
import { ConfirmActionModal } from "@/modal/ConfirmActionModal";
import { useState } from "react";
import { deleteBusinessById } from "@/database/business";
import { auth } from "@/database/firebase";

export function DeleteAccountButton() {
  const { user, accountType, setUser, setAccountType } = useUserContext();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleLogout = () => {
    auth.signOut()
        .then(() => {
            setUser(null);
            setAccountType(null);
            setUserAccountType("");
        })
        .catch(() => {
            // setError(error.message);
        });
};

  const handleDelete = () => {
    if (accountType === "Student") {
      getApplications()
        .then((res) => {
          res.map((application) => {
            if (application.studentId === user?.uid) {
              deleteApplicationsById(application.uid);
            }
          });
        })
        .then(() => {
          deleteStudentById(user.uid);
        //   handleLogout()
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (accountType === "Business") {
      getApplications()
        .then((res) => {
          res.map((application) => {
            if (application.businessId === user?.uid) {
              deleteApplicationsById(application.uid);
            }
          });
        })
        .then(() => {
          deleteBusinessById(user.uid);
        //   handleLogout()
        })
        .catch((err) => {
          console.log(err);
        });
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
