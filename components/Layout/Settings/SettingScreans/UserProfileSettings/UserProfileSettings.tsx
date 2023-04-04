import { db, storage } from "@/firebase";
import {
	doc,
	updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../../context/AuthContext";
import { useLocalStorage } from "../../../../../hooks/useLocalStorage";
import useUserProfileSettings from "../../../../../hooks/useUserProfileSettings";

const UserProfileSettings = () => {
	
  const userProfileSettings = useUserProfileSettings()

  const { setItem } = useLocalStorage();
  const [img, setImg] = useState<File | null>(null);

	const  currentUser = useContext(AuthContext);

	if(userProfileSettings.isOpen == false){
		return null
	}
	
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
			
			uploadBytes(storageRef, img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(async (downloadURL) => {
					currentUser.currentUser.photoURL = downloadURL
					setItem('photoURL', downloadURL);
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