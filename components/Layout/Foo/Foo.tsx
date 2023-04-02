import React from "react";
import Sidebar from "../../Sidebar/Sidebar";

interface FooProps {
	isOpen?: boolean
}

const Foo: React.FC<FooProps> = ({isOpen}) => {

	if(isOpen == false){
		return null
	}

	const sidebarContent = (
		<div className="">
			Foo
		</div>
	)

	const profile = (
		<div className="">Foooo</div>
	)

	return (
		<div className="chats__container">
			<Sidebar content={sidebarContent} profile={profile}/>
			<div className="chat">foo</div>
		</div>
	)
}

export default Foo