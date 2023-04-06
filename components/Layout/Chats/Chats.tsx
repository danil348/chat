import { db } from "@/firebase";
import { doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { GroupChatContext } from "../../../context/GroupChatContext";
import useGroupMessages from "../../../hooks/useGroupMessages";
import useMessages from "../../../hooks/useMessages";
import useSearchModal from "../../../hooks/useSearchModal";
import useSelectUsersModal from "../../../hooks/useSelectUsersModal";
import Sidebar from "../../Sidebar/Sidebar";
import TopBar from "../../TopBar/TopBar";
import Profile from "../Profile/Profile";
import GroupMessages from "./GroupMessages/GroupMessages";
import MessageInput from "./MessageInput/MessageInput";
import Messages from "./Messeges/Messeges";
import SelectUsersModal from "./SelectUsersModal/SelectUsersModal";


interface ChatsProps {
	isOpen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({isOpen}) => {

	const [chats, setChats] = useState<DocumentData>([])
	const [groupChats, setGroupChats] = useState<DocumentData>([])

  const searchModal = useSearchModal()
  const selectedUsersModal = useSelectUsersModal()
  const groupMessages = useGroupMessages()
  const messages = useMessages()
	
  const userContext = useContext(AuthContext)
	const { dispatch } = useContext(ChatContext);
	const { dispatchGroupChats } = useContext(GroupChatContext);
  const { state } = useContext(ChatContext);
  const { ChatState } = useContext(GroupChatContext);
	
	useEffect(() => {
		if(ChatState.ChatsInfo?.uid){
			const Unsube = onSnapshot(doc(db, "groupChats", ChatState.ChatsInfo?.uid), (doc) => {
				doc.exists() && setGroupChats(doc.data().groupChats);
			});

			return () => {
				Unsube()
			}
		}
		if(userContext.currentUser?.uid){
			const unsub = onSnapshot(doc(db, "userChats", userContext?.currentUser?.uid), (doc) => {
				setChats(doc.data() as DocumentData);
			});
			
			const _unsub = onSnapshot(doc(db, "users", userContext.currentUser?.uid), (doc) => {
				doc.exists() && setGroupChats(doc.data().groupChats);
			});

			const __unsub = onSnapshot(doc(db, "users", userContext.currentUser?.uid), async (docs) => {
				const docRef = doc(db, "users", userContext.currentUser?.uid);
				const docSnap = await getDoc(docRef);
				if(docSnap.data()?.photoURL){
					userContext.setCurrentUser({
						name: docSnap.data()?.username,
						displayName: docSnap.data()?.displayName,
						email: docSnap.data()?.email,
						uid: docSnap.data()?.uid,
						photoURL: docSnap.data()?.photoURL
					})
				}
			});

			return () => {
				_unsub();
				unsub();
				__unsub();
			};
		}
		
  }, [userContext.currentUser?.uid]);

	const handleSelect = (u : any) => {
		dispatch({type: "CHANGE_USER", payload: u})
	}
	
	const handleSelectGroupChats = async (u : any) => {
		
		const docRef = doc(db, "groupChats", u.id);
    const docSnap = await getDoc(docRef)

		dispatchGroupChats({type: "CHANGE_CHATS", payload: docSnap.data()})
	}
	

	if(isOpen == false){
		return null;
	}

	const GroupChatsContent = (
		<>
			{groupChats && Object.entries(groupChats)?.map((chat, index) => {
					return (
						<div 
							className={groupMessages.isOpen && (chat[0] == ChatState.ChatsInfo.uid) ? "group-chats sidebar__item sidebar-item selected" : "group-chats sidebar__item sidebar-item"} 
							key={chat[0]}
							onClick={() => {
								handleSelectGroupChats(chat[1])
								messages.onClose()
								groupMessages.onOpen()
							}}
						>
							<div className="group-chats__usersCount sidebar-item__image">
								<FiUsers color="white" size={20}/>
							</div>
						<div
							className="group-chats__names"
						>
							<div className="group-chats__name">
								{chat[1].users && chat[1].users?.map((item: any, idx: number) => {
									return item.name + ", "
								})}
							</div>
							<div className="group-chats__usersCount">{chat[1].usersCount} участников</div>
						</div>
				</div>
					)
				})}
		</>
	)

	const ChatsContent = (
		<>
			{chats && Object.entries(chats)?.map(chat => (
				<div 
					className={messages.isOpen && (chat[1].userInfo?.uid == state.user?.uid) ? "sidebar__item sidebar-item selected" : "sidebar__item sidebar-item"} 
					key={chat[0]}
					onClick={() => {
						handleSelect(chat[1].userInfo)
						groupMessages.onClose()
						messages.onOpen()
					}}
				>
					<div className="sidebar-item__image" >
						{chat[1].userInfo?.photoURL ? <img loading="lazy" src={chat[1].userInfo?.photoURL} alt=""/> : <BsDiscord size={20} color='white'/>}
					</div>
					<div className="">{chat[1].userInfo?.displayName}</div>
				</div>
			))}
		</>
	)

	const sidebarContent = (
		<div className="sidebar__content">
			<div className="sidebar__info sidebar-info">
				<SelectUsersModal chats={chats}/>
				<div className="sidebar-info__text">Личные сообщения</div>
				<div className="sidebar-info__button" onClick={() => {
					selectedUsersModal.onToggle(selectedUsersModal.isOpen)
				}}>
					<AiOutlinePlus size={20} />
					<div className="sidebar-info__prompt">Создать чат</div>
				</div>
			</div>
			{ChatsContent}
			{GroupChatsContent}
		</div>
	)

	const searchContent = (
		<div className="search__wrapper">
			<button className="search__button" onClick={() => {searchModal.onOpen()}}>Найти беседу</button>
		</div>
		//<Search placeholder="Найти беседу" onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => handleKey(e)} />
	)

	const profile = (
		<Profile 
			name="alex" 
			img={userContext.currentUser?.photoURL && <img loading="lazy" src={userContext.currentUser?.photoURL} alt=""/>}
			id="#1231233"
		/>
	)

	return (
		<div className="chats__container">
			<Sidebar content={sidebarContent} profile={profile} searchInput={searchContent}/>
			<div className="chat">
				<TopBar profile={state.user}/>
				{messages.isOpen && <Messages/>} 
				{groupMessages.isOpen && <GroupMessages/>}
				<div className="chatInput__wrapper">
					<MessageInput/>
				</div>
			</div>
		</div>
	)
}

export default Chats