import { db } from "@/firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import useSelectUsersModal from "../../../../hooks/useSelectUsersModal";

const SelectUsersModal = () => {

  const selectedUsersModal = useSelectUsersModal()

  const userContext = useContext(AuthContext)
	
	const handleCreateChat = async () => {
		const uid = uuid();

		await setDoc(doc(db, "groupChats", uid), { messages: [] });

		await updateDoc(doc(db, "users", userContext.currentUser.uid), {
			groupChats: arrayUnion({
				id: uid,
				name: "foo",
				usersCount: 1
			}),
		});
	}
	
	if(selectedUsersModal.isOpen == false){
		return null
	}

	return (
		<div className="sidebar__selectUsersModal">
			asd
		</div>
	)
}

export default SelectUsersModal