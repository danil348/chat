import { db } from "@/firebase";
import {
  doc,
  onSnapshot
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { HiArrowDown } from "react-icons/hi";
import Scrollbar from "smooth-scrollbar";
import { GroupChatContext } from "../../../../context/GroupChatContext";
import Message from "../Messege/Messege";

const overscrollOptions = {
  enable: true,
  effect: 'bounce',
  damping: 0.15,
  renderByPixels: false,
  continuousScrolling: true,
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
  const { ChatState } = useContext(GroupChatContext);

  const [scrollbar, setScrollbar] = useState<Scrollbar>()
  const [groupMessagesContainer, setGroupMessagesContainer] = useState<boolean>(false);
	const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0)
	
  const [offsetY, setOffsetY] = useState(0)
  const [offsetX, setOffsetX] = useState(0) 

	useEffect(() => {
    if(!groupMessagesContainer){
      const messageWrapper = document.getElementById('groupMessages')
      if(messageWrapper){
        setGroupMessagesContainer(true)
        setScrollbar(Scrollbar.init(messageWrapper, options))
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

	useEffect(()=>{
    if(messages.length < messageCount){
      setMessageCount(messages.length)
    }else if(messages.length != messageCount){
      setTimeout(() => {
        if(scrollbar){
          scrollbar.scrollTop = scrollbar.size.content.height
        }
      }, 100);
      setMessageCount(messages.length)
    }
  },[messages])

  
  useEffect(() => {
    scrollbar?.addListener(({ offset }) => {
      setOffsetY(offset.y + scrollbar.size.container.height - 80)
      setOffsetX(offset.x + scrollbar.size.container.width - 90)
    });
  },[scrollbar])

	return (
    <>
    {scrollbar?.size.content.height - (scrollbar?.scrollTop + scrollbar?.size.container.height) > scrollbar?.size.container.height / 2 && 
          <div className="scroll-button"
            onClick={() => {
              scrollbar?.scrollTo(scrollbar.offset.x, scrollbar.size.content.height, 600);
            }}  
          >
            <HiArrowDown size={25} color="rgb(195, 195, 195)"/>
          </div>
    }
        
		<div className="messages" id="groupMessages">
			<div className="scroll-content">
			
				{messages && Object.entries(messages)?.map((m, index) => (
					<Message message={m[1]} key={index}  index={index} messages={messages}/>
				))}
      </div>
		</div>
    </>
	)
}

export default GroupMessages