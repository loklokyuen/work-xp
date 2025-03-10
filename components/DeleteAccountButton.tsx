import { deleteApplicationsById, getApplications } from "@/database/applications"
import { Button } from "react-native-paper"
import { useUserContext } from "@/context/UserContext"
import { deleteStudentById } from "@/database/student"
import { ConfirmActionModal } from "@/modal/ConfirmActionModal"
import { useState } from "react"

export function DeleteAccountButton() {
    const {user} = useUserContext()
    const [openDelete, setOpenDelete] = useState<boolean>(false)

    const handleDelete = () => {
        getApplications().then((res) => {
            res.map((application) => {
                if(application.studentId === user?.uid){
                    deleteApplicationsById(application.uid)
                }
            })
        }).then(() => {
            deleteStudentById(user.uid)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
        <Button mode="contained-tonal" onPress={() => setOpenDelete(true)}>Delete Account</Button>
        <ConfirmActionModal 
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Are you sure?"
        onConfirmAction={handleDelete}
        />
        </>
    )
}