import { db } from "@/firebase";
import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import mainBg from "../../../public/mainBg.png";
import Sidebar from "../../Sidebar/Sidebar";
import Profile from "../Profile/Profile";
import Search from "../Search/Search";


interface ChatsProps {
	isOpen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({isOpen}) => {

  const userContext = useContext(AuthContext)
	
	const [value, setValue] = useState<string>('')
	const [user, setUser] = useState<DocumentData>({})
	const [err, setErr] = useState(false);

	const handleSearch = async () => {
		console.log(value)
		const q = query(
      collection(db, "users"),
      where("displayName", "==", value)
    );

		try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
	}

	const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			handleSearch()
		}
	}
	
	if(isOpen == false){
		return null;
	}


	const sidebarContent = (
		<div className="sidebar__content">
			{ user.displayName != userContext.currentUser.name && <div className="">
				{user.displayName} <tr/>
				{user.email}
			</div> }
		</div>
	)

	const searchContent = (
		<Search placeholder="Найти беседу" onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => handleKey(e)} />
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