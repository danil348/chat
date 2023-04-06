import { db } from "@/firebase";
import {
	doc,
	onSnapshot
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Scrollbar from "smooth-scrollbar";
import { GroupChatContext } from "../../../../context/GroupChatContext";
import Message from "../Messege/Messege";

const overscrollOptions = {
  enable: true,
  effect: 'bounce',
  damping: 0.15,
  maxOverscroll: 150,
  glowColor: '#787878',
};

const options = {
  damping : 0.07,
  plugins: {
    overscroll: { ...overscrollOptions },
  },
  
}

const GroupMessages = () => {
	const { dispatchGroupChats } = useContext(GroupChatContext);
  const { ChatState } = useContext(GroupChatContext);

  const [groupMessagesContainer, setGroupMessagesContainer] = useState<boolean>(false);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
    if(!groupMessagesContainer){
      const messageWrapper = document.getElementById('groupMessages')
      if(messageWrapper){
        setGroupMessagesContainer(true)
        Scrollbar.init(messageWrapper, options);
      }
    }

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
		<div className="messages" id="groupMessages">
			<div className="scroll-content">
				{messages && Object.entries(messages)?.map((m, index) => (
					<Message message={m[1]} key={index} />
				))}
      </div>
		</div>
	)
}

export default GroupMessages