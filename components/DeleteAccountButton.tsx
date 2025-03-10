import { deleteApplicationsById, getApplications } from "@/database/applications"
import { Button } from "react-native-paper"
import { useUserContext } from "@/context/UserContext"
import { deleteStudentById } from "@/database/student"

export function DeleteAccountButton() {
    const {user} = useUserContext()

    const handleDelete = () => {
        getApplications().then((res) => {
            res.map((application) => {
                if(application.studentId === user?.uid){
                    deleteApplicationsById(application.uid)
                }
            })
        }).then(() => {
            deleteStudentById(user?.uid)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
        <Button mode="contained-tonal" onPress={handleDelete}>Delete Account</Button>
        </>
    )
}