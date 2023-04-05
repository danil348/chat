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
		if(selectedUsers.length == 0){
			return;
		}
		const uid = uuid();

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
			["groupChats." + uid]: {
				id: uid,
				name: "foo",
				usersCount: selectedUsers.length + 1
			},
			["groupChats." + uid+ ".users"]: arrayUnion({
				name: userContext.currentUser.name
			})
		});
		


		Object.entries(chats)?.map(async (chat, index) => {
			if(selectedUsers.includes(index)){
				await updateDoc(doc(db, "users", userContext.currentUser.uid), {
					["groupChats." + uid+ ".users"]: arrayUnion({
						name: chat[1].userInfo?.displayName
					})
				});

				await updateDoc(doc(db, "users", chat[1].userInfo?.uid), {
					["groupChats." + uid]: {
						id: uid,
						name: "foo",
						usersCount: selectedUsers.length + 1
					},
					["groupChats." + uid+ ".users"]: arrayUnion({
						name: userContext.currentUser.name
					})
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

				Object.entries(chats)?.map(async (pchat, pindex) => {
					if(selectedUsers.includes(pindex)){
						await updateDoc(doc(db, "users", chat[1].userInfo?.uid), {
							["groupChats." + uid+ ".users"]: arrayUnion({
								name: pchat[1].userInfo?.displayName
							})
						});
					}
				})
			}
		})
		setSelectedUsers([])
		setSelectedUserCount(0)
	}

	const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			console.log("Отправка")
		}
	}
	
	const  handleChange = async (index: number) => {
		let copy = Object.assign([], selectedUsers)
		if(selectedUsers.includes(index) == false){
			if(selectedUserCount < maxSelectedUser){
				copy.push(index)
				setSelectedUsers(copy)
	
				setSelectedUserCount(selectedUserCount+1)
			}
		}else{
			if(copy.length == 1){
				setSelectedUsers([])
				
				setSelectedUserCount(selectedUserCount-1)
			}else{
				copy.splice(copy.indexOf(index), 1)
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
			<div className="sidebar-selectUsersModal__users" >
			{chats && Object.entries(chats)?.map((chat, index) => (
				<div className="sidebar__item sidebar-item" key={chat[0]} onClick={() => handleChange(index)} >
					<SelectUserItem
						photoURL={chat[1].userInfo?.photoURL}
						name={chat[1].userInfo?.displayName}
						selected={selectedUsers.includes(index)}
					/>
				</div>
			))}
			</div>
			<div className="sidebar-selectUsersModal__CreateButton" onClick={() => {
				handleCreateChat()
			}} >Создать лс</div>
		</div>
	)
}

export default SelectUsersModal