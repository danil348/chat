import { db, storage } from "@/firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
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
  const [image, setImage] = useState<string>()

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
                userPhotoURL: currentUser.currentUser?.photoURL,
                reactions: {}
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
                reactions: {}
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
              userPhotoURL: currentUser.currentUser?.photoURL,
              reactions: {}
            }),
          });
        }else{
          await updateDoc(doc(db, "chats", state.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser.uid,
              date: Timestamp.now(),
              reactions: {}
            }),
          });
        }
      }
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
                userPhotoURL: currentUser.currentUser?.photoURL,
                reactions: {}
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
                reactions: {}
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
              userPhotoURL: currentUser.currentUser?.photoURL,
              reactions: {}
            })
          });
        }else{
          await updateDoc(doc(db, "groupChats", ChatState.ChatsInfo?.uid), { 
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.currentUser?.uid,
              date: Timestamp.now(),
              reactions: {}
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
      setMessages()
    }else if(groupMessages.isOpen){
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

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
   }

  return (
    <>
      {(groupMessages.isOpen || messages.isOpen) && 
        <div className="input">
          {img && <div className="input-image__preview image-preview">
            <div className="image-preview__removeButton" onClick={() => {
              setImg(null)
            }}>
              <MdClose color="rgb(195, 195, 195)" size={25} style={{cursor: "pointer"}}/>
            </div>
            <img loading="lazy" src={image} alt="" id="img" />
          </div>
          }
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
                  onImageChange(e)
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