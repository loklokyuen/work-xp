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
import { auth } from "@/database/firebase";
import { getAuth, deleteUser } from "firebase/auth";

export function DeleteAccountButton() {
  const { user, accountType, setUser, setAccountType } = useUserContext();
  const auth = getAuth();
  const userCurr = auth.currentUser;
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleLogout = () => {
    auth.signOut()
        .then(() => {
            setUser(null);
            setAccountType(null);
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
            deleteUser(userCurr)
        }).then(() => {
            deleteStudentById(user.uid);
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
            deleteUser(userCurr)
        }).then(() => {
            deleteBusinessById(user.uid);
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
