import { db } from "@/firebase";
import {
	doc,
	onSnapshot
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { GroupChatContext } from "../../../../context/GroupChatContext";

interface GroupMessagesProps {

}

const GroupMessages: React.FC<GroupMessagesProps> = () => {
	const { dispatchGroupChats } = useContext(GroupChatContext);
  const { ChatState } = useContext(GroupChatContext);

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if(ChatState.ChatsInfo?.uid){
			const unSub = onSnapshot(doc(db, "groupChats", ChatState.ChatsInfo?.uid), (doc) => {
				doc.exists() && setMessages(doc.data().messages);
			});
	
			return () => {
				unSub();
			};
		}
  }, [ChatState.ChatsInfo?.uid]);
	

	return (
		<div className="messages">
			{messages && Object.entries(messages)?.map((message: any, index: number) => {
				console.log()
				return (
					<div className="" key={index}>
						{message[1]?.text}
					</div>
				)
			})}
		</div>
	)
}

export default GroupMessages