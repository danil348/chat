import React from "react";
import Sidebar from "../../Sidebar/Sidebar";

interface ChatsProps {
	isOpen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({isOpen}) => {

	if(isOpen == false){
		return null;
	}

	const sidebarContent = (
		<div className="">
			asd
		</div>
	)

	const profile = (
		<div className="">profile</div>
	)

	return (
		<div className="chats__container">
			<Sidebar content={sidebarContent} profile={profile}/>
			<div className="chat">foo</div>
		</div>
	)
}

export default Chats