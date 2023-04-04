import { db, storage } from "@/firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { RiImageLine, RiMailSendLine } from "react-icons/ri";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../context/AuthContext";
import { ChatContext } from "../../../../context/ChatContext";

const Input = () => {
  const [text, setText] = useState("");

  const [img, setImg] = useState<File | null>(null);
  const  currentUser = useContext(AuthContext);
  const { state } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
			
			uploadBytes(storageRef, img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
					await updateDoc(doc(db, "chats", state.chatId), {
						messages: arrayUnion({
							id: uuid(),
							text,
							senderId: currentUser.currentUser.uid,
							date: Timestamp.now(),
							img: downloadURL,
						}),
					});
				});
			});
    } else {
      await updateDoc(doc(db, "chats", state.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

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

    setText("");
    setImg(null);
  };
  return (
    <>
      {state.user?.displayName && 
        <div className="input">
          <input
            type="text"
            placeholder={"Написать @" + state.user?.displayName}
            onChange={(e) => setText(e.target.value)}
            value={text}
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