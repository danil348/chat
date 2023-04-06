import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    if(!messagesContainer){
      const messageWrapper = document.getElementById('messages')
      if(messageWrapper){
        setMessagesContainer(true)
        Scrollbar.init(messageWrapper, options);
      }
    }

    const unSub = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [state.chatId]);

  return (
    <div className="messages" id="messages">
      <div className="scroll-content">
        {messages.map((m, index) => (
          <Message message={m} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Messages;