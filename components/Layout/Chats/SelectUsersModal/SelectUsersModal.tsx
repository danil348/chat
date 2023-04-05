import { db } from "@/firebase";
import { DocumentData, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../context/AuthContext";
import useSelectUsersModal from "../../../../hooks/useSelectUsersModal";
import Search from "../../Search/Search";
import SelectUserItem from "./SelectUserItem/SelectUserItem";

interface SelectUsersModalProps {
	chats: DocumentData
}

const SelectUsersModal: React.FC<SelectUsersModalProps> = ({chats}) => {

	const [value, setValue] = useState<string>('')
	const [err, setErr] = useState(false)
	const [selectedUserCount, setSelectedUserCount] = useState(0)
	const maxSelectedUser = 10;

  const selectedUsersModal = useSelectUsersModal()

  const userContext = useContext(AuthContext)

	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

	const handleCreateChat = async () => {
		const uid = uuid();

		console.log(uid)
		await setDoc(doc(db, "groupChats", uid), { messages: [], Users: [] });
		await updateDoc(doc(db, "groupChats", uid), { 
			ChatsInfo: arrayUnion({
				name: "foo",
				usersCount: selectedUsers.length + 1
			})
		});

		if(userContext.currentUser?.photoURL){
			await updateDoc(doc(db, "groupChats", uid), { 
				Users: arrayUnion({
					name: userContext.currentUser?.name,
					id: userContext.currentUser?.uid,
					photoURL: userContext.currentUser?.photoURL
				})
			});
		}else{
			await updateDoc(doc(db, "groupChats", uid), { 
				Users: arrayUnion({
					name: userContext.currentUser?.name,
					id: userContext.currentUser?.uid,
				})
			});
		}
		

		await updateDoc(doc(db, "users", userContext.currentUser.uid), {
			groupChats: arrayUnion({
				id: uid,
				name: "foo",
				usersCount: selectedUsers.length + 1
			}),
		});
		

		Object.entries(chats)?.map(async (chat, index) => {
			if(selectedUsers.includes(index)){
				await updateDoc(doc(db, "users", chat[1].userInfo?.uid), {
					groupChats: arrayUnion({
						id: uid,
						name: "foo",
						usersCount: selectedUsers.length + 1
					}),
				});

				if(chat[1].userInfo?.photoURL){
					await updateDoc(doc(db, "groupChats", uid), { 
						Users: arrayUnion({
							name: chat[1].userInfo?.displayName,
							id: chat[1].userInfo?.uid,
							photoURL: chat[1].userInfo?.photoURL
						})
					});
				}else{
					await updateDoc(doc(db, "groupChats", uid), { 
						Users: arrayUnion({
							name: chat[1].userInfo?.displayName,
							id: chat[1].userInfo?.uid,
						})
					});
				}
			}
		})
	}

	const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			console.log("Отправка")
		}
	}
	
	const  handleChange = async (state: boolean, index: number) => {
		let copy = Object.assign([], selectedUsers)
		if(state == true){
			copy.push(index)
			setSelectedUsers(copy)

			setSelectedUserCount(selectedUserCount+1)
		}else{
			if(copy.length == 1){
				copy.length = 0;
				setSelectedUsers(copy)
				
				setSelectedUserCount(selectedUserCount-1)
			}else{
				copy = copy.splice(copy.indexOf(index) - 1, 1)
				setSelectedUsers(copy)
	
				setSelectedUserCount(selectedUserCount-1)
			}
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
			<div className="sidebar-selectUsersModal__counter">Вы можете добавить ещё {maxSelectedUser - selectedUserCount} друзей</div>
			<div className="sidebar-selectUsersModal__input">
			<Search placeholder="Введите имя пользователя вашего друга" onChange={(e: any) => {
							setValue(e.target.value)
							setErr(false)
						}}
						 onKeyDown={(e: any) => handleKey(e)} 
						 />
			</div>
			<div className="sidebar-selectUsersModal__users">
			{chats && Object.entries(chats)?.map((chat, index) => (
				<SelectUserItem
					freeUsersNumber={maxSelectedUser - selectedUserCount}
					index={index}
					onChange={handleChange}
					key={chat[0]}
					photoURL={chat[1].userInfo?.photoURL}
					name={chat[1].userInfo?.displayName}
				/>
			))}
			</div>
			<div className="sidebar-selectUsersModal__CreateButton" onClick={() => {
				console.log("Создание чата")
				console.log(selectedUsers)
				handleCreateChat()
			}} >Создать лс</div>
		</div>
	)
}

export default SelectUsersModal