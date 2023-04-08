import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { HiArrowDown } from "react-icons/hi";
import Scrollbar from "smooth-scrollbar";
import { ChatContext } from "../../../../context/ChatContext";
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

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [messagesContainer, setMessagesContainer] = useState<boolean>(false);

  const { state } = useContext(ChatContext);
  const [scrollbar, setScrollbar] = useState<Scrollbar>()
  const [messageCount, setMessageCount] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [offsetX, setOffsetX] = useState(0) 
  
  useEffect(() => {
    if(!messagesContainer){
      const messageWrapper = document.getElementById('messages')
      if(messageWrapper){
        setMessagesContainer(true)
        setScrollbar(Scrollbar.init(messageWrapper, options));
      }
    }

    const unSub = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [state.chatId]);
  

  useEffect(() => {
    scrollbar?.addListener(({ offset }) => {
      setOffsetY(offset.y + scrollbar.size.container.height - 80)
      setOffsetX(offset.x + scrollbar.size.container.width - 90)
    });
  },[scrollbar])

  useEffect(()=>{
    if(messages.length < messageCount){
      setMessageCount(messages.length)
    }else if(messages.length != messageCount) {
      setTimeout(() => {
        if(scrollbar){
          scrollbar.scrollTop = scrollbar.size.content.height
        }
      }, 100);
      setMessageCount(messages.length)
    }
  },[messages])

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
        
    <div className="messages" id="messages">
      <div className="scroll-content">
        
        {messages.map((m, index) => {
          return (
            
            <Message message={m}  index={index} messages={messages}/>
          )
        })}
      </div>
    </div>
    </>
  );
};

export default Messages;