import { db, storage } from "@/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp, Timestamp, updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { RiImageLine, RiMailSendLine } from "react-icons/ri";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../context/AuthContext";
import { ChatContext } from "../../../../context/ChatContext";
import { GroupChatContext } from "../../../../context/GroupChatContext";
import useGroupMessages from "../../../../hooks/useGroupMessages";
import useMessages from "../../../../hooks/useMessages";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<File | null>(null);
  
	const { dispatchGroupChats } = useContext(GroupChatContext);
  const  currentUser = useContext(AuthContext);
  const { state } = useContext(ChatContext);
  const { ChatState } = useContext(GroupChatContext);
  
  const groupMessages = useGroupMessages()
  const messages = useMessages()

  const setMessages = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

			uploadBytes(storageRef, img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          if(currentUser.currentUser?.photoURL){
            await updateDoc(doc(db, "chats", state.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                senderId: currentUser.currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
                userPhotoURL: currentUser.currentUser?.photoURL
              }),
            });
          }else{
            await updateDoc(doc(db, "chats", state.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                senderId: currentUser.currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          }
				});
			});
    } else {
      if(text){
        if(currentUser.currentUser?.photoURL){
          await updateDoc(doc(db, "chats", state.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser.uid,
              date: Timestamp.now(),
              userPhotoURL: currentUser.currentUser?.photoURL
            }),
          });
        }else{
          await updateDoc(doc(db, "chats", state.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser.uid,
              date: Timestamp.now(),
            }),
          });
        }
      }
    }

    if(text){
      await updateDoc(doc(db, "userChats", currentUser.currentUser.uid), {
        [state.chatId + ".lastMessage"]: {
          text,
        },
        [state.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", state.user.uid), {
        [state.chatId + ".lastMessage"]: {
          text,
        },
        [state.chatId + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setImg(null);
  }

  const setGroupMessage = async () => {
    if(img){
      const storageRef = ref(storage, uuid());

			uploadBytes(storageRef, img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          if(currentUser.currentUser?.photoURL){
            await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.currentUser?.uid,
                date: Timestamp.now(),
                img: downloadURL,
                userPhotoURL: currentUser.currentUser?.photoURL
              })
            }); 
          }else{
            await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.currentUser?.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            });
          }
				});
			});
    }else{
      if(text){
        if(currentUser.currentUser?.photoURL){
          await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser?.uid,
              date: Timestamp.now(),
              userPhotoURL: currentUser.currentUser?.photoURL
            })
          });
        }else{
          await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser?.uid,
              date: Timestamp.now()
            })
          });
        }
        
      }
    }
    
    setText("");
    setImg(null);
  }

  const handleSend = async () => {
    if(messages.isOpen){
      console.log("send messages")
      setMessages()
    }else if(groupMessages.isOpen){
      console.log("send groupMessages")
      setGroupMessage()


      const docRef = doc(db, "groupChats", ChatState.ChatsInfo.uid);
      const docSnap = await getDoc(docRef)
		  dispatchGroupChats({type: "CHANGE_CHATS", payload: docSnap.data()})
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			handleSend()
		}
	}

  return (
    <>
      {(groupMessages || messages) && 
        <div className="input">
          <input
            type="text"
            placeholder={"Написать @" + state.user?.displayName}
            onChange={(e) => setText(e.target.value)}
            value={text}
						onKeyDown={(e) => handleKey(e)} 
          />
          <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => {
                if(e.target.files){
                  setImg(e.target.files[0])
                }
              }}
            />
            <label htmlFor="file" className="input__labelFile">
              <RiImageLine size={24} color="rgb(195, 195, 195)"/>
            </label>
            <div className="input__buttonSend">
              <RiMailSendLine className="send__button" onClick={handleSend} size={24} color="rgb(195, 195, 195)"/>
            </div>
        </div>
      }
    </>
    
  );
};

export default Input;