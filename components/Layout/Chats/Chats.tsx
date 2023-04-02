import React, { useState } from "react";
import mainBg from "../../../public/mainBg.png";
import Sidebar from "../../Sidebar/Sidebar";
import Profile from "../Profile/Profile";
import Search from "../Search/Search";


interface ChatsProps {
	isOpen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({isOpen}) => {

	const [value, setValue] = useState<string>('')

	
	if(isOpen == false){
		return null;
	}


	const sidebarContent = (
		<div className="sidebar__content">
			asd
		</div>
	)

	const searchContent = (
		<Search placeholder="Найти беседу" onChange={(e) => setValue(e.target.value)} />
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