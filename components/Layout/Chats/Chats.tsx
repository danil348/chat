import { db } from "@/firebase";
import { DocumentData, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { GroupChatContext } from "../../../context/GroupChatContext";
import useSearchModal from "../../../hooks/useSearchModal";
import useSelectUsersModal from "../../../hooks/useSelectUsersModal";
import Sidebar from "../../Sidebar/Sidebar";
import TopBar from "../../TopBar/TopBar";
import Profile from "../Profile/Profile";
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
	
  const userContext = useContext(AuthContext)
	const { dispatch } = useContext(ChatContext);
	const { dispatchGroupChats } = useContext(GroupChatContext);
  const { state } = useContext(ChatContext);
  const { ChatState } = useContext(GroupChatContext);
	
	useEffect(() => {
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
							key={index}
							onClick={() => handleSelectGroupChats(chat[1])}
						>
							{chat[1].users && chat[1].users?.map((item: any, idx: number) => {
								return (
									<div className="" key={idx}>
										{item.name}
									</div>
								)
							})}
						</div>
					)
				})}
		</>
	)

	const ChatsContent = (
		<>
			{chats && Object.entries(chats)?.map(chat => (
				<div 
					className={chat[1].userInfo?.uid == state.user?.uid ? "sidebar__item sidebar-item selected" : "sidebar__item sidebar-item"} 
					key={chat[0]}
					onClick={() => handleSelect(chat[1].userInfo)}
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
				<Messages/>
				<div className="chatInput__wrapper">
					<MessageInput/>
				</div>
			</div>
		</div>
	)
}

export default Chats