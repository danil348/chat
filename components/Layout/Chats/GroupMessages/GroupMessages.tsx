import { db } from "@/firebase";
import {
	doc,
	getDoc, onSnapshot
} from "firebase/firestore";
import { useContext, useEffect } from "react";
import { GroupChatContext } from "../../../../context/GroupChatContext";

interface GroupMessagesProps {

}

const GroupMessages: React.FC<GroupMessagesProps> = () => {
	const { dispatchGroupChats } = useContext(GroupChatContext);
	
  const { ChatState } = useContext(GroupChatContext);
	
	useEffect(() => {
		if(ChatState.ChatsInfo?.uid){
			const docRef = doc(db, "groupChats", ChatState.ChatsInfo?.uid);

			const unSub = onSnapshot(doc(db, "groupChats", ChatState.ChatsInfo?.uid), async (doc) => {
				const docSnap = await getDoc(docRef)
				dispatchGroupChats({type: "CHANGE_CHATS", payload: docSnap.data()})
			});
	
			return () => {
				unSub();
			};
		}

  }, [ChatState]);

	return (
		<div className="messages">
			{ChatState.messages && Object.entries(ChatState.messages)?.map((message: any, index: number) => {
				console.log()
				return (
					<>
					<div className="">
						{message[1]?.text}
					</div>
					</>
				)
			})}
		</div>
	)
}

export default GroupMessages