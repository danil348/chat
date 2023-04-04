import { db } from "@/firebase";
import { DocumentData, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import useSearchModal from "../../../hooks/useSearchModal";
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
  const searchModal = useSearchModal()
  const userContext = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext);
  const { state } = useContext(ChatContext);

	useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", userContext.currentUser?.uid), (doc) => {
        setChats(doc.data() as DocumentData);
      });

      return () => {
        unsub();
      };
    };

		const getUserImagee = () => {
      const unsub = onSnapshot(doc(db, "users", userContext.currentUser?.uid), async (docs) => {
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
        unsub();
      };
    };

		userContext.currentUser?.uid && getUserImagee();
    userContext.currentUser?.uid && getChats();
  }, [userContext.currentUser?.uid]);

	const handleSelect = (u : any) => {
		dispatch({type: "CHANGE_USER", payload: u})
	}

	if(isOpen == false){
		return null;
	}

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

	const sidebarContent = (
		<div className="sidebar__content">
			<div className="sidebar__info sidebar-info">
				<SelectUsersModal/>
				<div className="sidebar-info__text">Личные сообщения</div>
				<div className="sidebar-info__button" onClick={handleCreateChat}>
					<AiOutlinePlus size={20} />
					<div className="sidebar-info__prompt">Создать чат</div>
				</div>
			</div>
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