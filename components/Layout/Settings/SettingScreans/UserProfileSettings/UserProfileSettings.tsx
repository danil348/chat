import { db, storage } from "@/firebase";
import {
	DocumentData,
	doc,
	onSnapshot,
	serverTimestamp,
	updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../../context/AuthContext";
import useUserProfileSettings from "../../../../../hooks/useUserProfileSettings";

const UserProfileSettings = () => {
	
  const userProfileSettings = useUserProfileSettings()

	const [chats, setChats] = useState<DocumentData>([])
  const [img, setImg] = useState<File | null>(null);
  const userContext = useContext(AuthContext)
	
	const  currentUser = useContext(AuthContext);

	useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", userContext.currentUser?.uid), (doc) => {
        setChats(doc.data() as DocumentData);
      });

      return () => {
        unsub();
      };
    };

    userContext.currentUser?.uid && getChats();
  }, [userContext.currentUser?.uid]);
	
	if(userProfileSettings.isOpen == false){
		return null
	}

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
			
			uploadBytes(storageRef, img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
					currentUser.currentUser.photoURL = downloadURL

					Object.entries(chats)?.map(async chat => {
						const combinedId = userContext.currentUser?.uid > chat[1].userInfo?.uid ? 
							userContext.currentUser?.uid + chat[1].userInfo?.uid : chat[1].userInfo?.uid + userContext.currentUser?.uid;

						await updateDoc(doc(db, "userChats", chat[1].userInfo?.uid as any), {
							[combinedId + ".userInfo"]: {
								uid: userContext.currentUser?.uid,
								displayName: userContext.currentUser?.name,
								photoURL: userContext.currentUser.photoURL
							},
							[combinedId + ".date"]: serverTimestamp(),
						});
					})

					await updateDoc(doc(db, "users", currentUser.currentUser.uid), {
						photoURL: downloadURL,
					});
				});
			});
    } 
  
    setImg(null);
  };

	return (
		<div>
			<input required style={{ display: "none" }} type="file" id="file" 
			onChange={(e) => {
				if(e.target.files){
					setImg(e.target.files[0])
				}
			}}/>
          <label htmlFor="file">
            <span>Add an avatar</span>
          </label>
					<button onClick={handleSend} >Sign up</button>
		</div>
	)
}

export default UserProfileSettings