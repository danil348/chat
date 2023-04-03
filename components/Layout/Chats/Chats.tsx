import { db } from "@/firebase";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useSearchModal from "../../../hooks/useSearchModal";
import mainBg from "../../../public/mainBg.png";
import Sidebar from "../../Sidebar/Sidebar";
import Profile from "../Profile/Profile";


interface ChatsProps {
	isOpen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({isOpen}) => {

	const [chats, setChats] = useState<DocumentData>([])
  const searchModal = useSearchModal()
  const userContext = useContext(AuthContext)

	useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", userContext.currentUser?.uid), (doc) => {
        setChats(doc.data() as DocumentData);
      });

      return () => {
        unsub();
      };
    };

    userContext.currentUser?.uid && getChats();
  }, [userContext.currentUser?.uid]);
	console.log(Object.entries(chats))

	if(isOpen == false){
		return null;
	}


	const sidebarContent = (
		<div className="sidebar__content">
			{Object.entries(chats)?.map(chat => (
				<div className="123" key={chat[0]}>{chat[1].userInfo.displayName}</div>
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
			img={<img loading="lazy" src={mainBg.src} alt=""/>}
			id="#1231233"
		/>
	)

	return (
		<div className="chats__container">
			<Sidebar content={sidebarContent} profile={profile} searchInput={searchContent}/>
			<div className="chat">foo</div>
		</div>
	)
}

export default Chats