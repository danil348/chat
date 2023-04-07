import { db } from "@/firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsCheckAll, BsDiscord } from "react-icons/bs";
import { AuthContext } from "../../../../context/AuthContext";
import { ChatContext } from "../../../../context/ChatContext";
import { GroupChatContext } from "../../../../context/GroupChatContext";
import useGroupMessages from "../../../../hooks/useGroupMessages";
import useMessages from "../../../../hooks/useMessages";

interface MessageProps {
  message: any
  index: number
  messages: Object
}

const Message: React.FC<MessageProps> = ({message, index, messages}) => {

  const currentUser  = useContext(AuthContext);
  const { ChatState } = useContext(GroupChatContext);
  const { state } = useContext(ChatContext);

  const groupMessagesState = useGroupMessages()
  const messagesState = useMessages()

  const [text, setText] = useState(message.text);
  const [edit, setEdit] = useState(false);

  const deleteMessage = async () => {
    if(groupMessagesState.isOpen){
      try {
        await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), {
          ["messages"]: arrayRemove(message)
        });
      } catch (error) {
        
      }
    }

    if(messagesState.isOpen){
      try {
        await updateDoc(doc(db, "chats", state.chatId), {
          ["messages"]: arrayRemove(message)
        });
      } catch (error) {
        
      }
    }
  }

  const changeText = (e: any) => {
    setText(e.target.value)
  }

  const editMessage = async () => {
    if(groupMessagesState.isOpen){
      const newMessages = messages as any;
      newMessages[index].text = text;
      
      try {
        setEdit(false)
        await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
          messages: newMessages as Object 
        }); 
      } catch (error) {
        
      }
    }
    if(messagesState.isOpen){
      const newMessages = messages as any;
      newMessages[index].text = text;

      try {
        setEdit(false)
        await updateDoc(doc(db, "chats", state.chatId), { 
          messages: newMessages as Object 
        }); 
      } catch (error) {
        
      }
    }
  }

	return (
    <div
      className={message.senderId === currentUser.currentUser.uid && "owner" ? "message owner" : "message neighbor"}
    >
      <div className="message__buttons message-buttons">
        <div className="message-buttons__delete message-button" onClick={deleteMessage}>
          <AiFillDelete color="#f23f42" size={20}/>
        </div>
        <div className="message-buttons__delete message-button" onClick={() => {
          if(message.senderId == currentUser.currentUser?.uid){
            setEdit(!edit)
            setText(message.text)
          }
        }}>
          <AiFillEdit color="rgb(164, 164, 164)" size={20}/>
        </div>
      </div>
      <div className="message__userPhoto">
        <BsDiscord size={25} color='white'/>
        {message.userPhotoURL && <img loading="lazy" src={message.userPhotoURL} alt=""/>}
      </div>
      <div className="messageInfo">
        <span>just now</span>
      </div>
				<p>{message.senderId}</p>
      <div className="messageContent">
        <div className="message__text">
          {message.text}
          <div className={edit ? "message__editor show" : "message__editor"}>
            <div className="message__editor-acceptButton" onClick={editMessage}>
              <BsCheckAll color="rgb(30, 164, 30)" size={20}/>
            </div>
            <textarea 
              
              name="" id="" value={text} onChange={(e) =>  changeText(e)}></textarea>
          </div>
        </div>
      </div>
			<div className="messageContent">
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;