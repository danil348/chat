import { db } from "@/firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../../../../context/AuthContext";
import useSelectUsersModal from "../../../../hooks/useSelectUsersModal";
import Search from "../../Search/Search";

const SelectUsersModal = () => {

	const [value, setValue] = useState<string>('')
	const [err, setErr] = useState(false);
	
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

	const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			console.log("Отправка")
		}
	}
	
	if(selectedUsersModal.isOpen == false){
		return null
	}

	return (
		<div className="sidebar__selectUsersModal sidebar-selectUsersModal">
			<div className="sidebar-selectUsersModal__closeButton" onClick={selectedUsersModal.onClose} >
				<AiOutlineClose size={22} color="white" />
			</div>
			<div className="sidebar-selectUsersModal__title">Выберите друзей</div>
			<div className="sidebar-selectUsersModal__counter">Вы можете добавить ещё друзей</div>
			<div className="sidebar-selectUsersModal__input">
			<Search placeholder="Введите имя пользователя вашего друга" onChange={(e: any) => {
							setValue(e.target.value)
							setErr(false)
						}}
						 onKeyDown={(e: any) => handleKey(e)} 
						 />
			</div>
			<div className="sidebar-selectUsersModal__users">
			</div>
			<div className="sidebar-selectUsersModal__CreateButton" onClick={() => {
				console.log("Создание чата")
			}} >Создать лс</div>
		</div>
	)
}

export default SelectUsersModal