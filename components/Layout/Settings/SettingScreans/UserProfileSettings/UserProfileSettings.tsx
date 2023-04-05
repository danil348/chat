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
import { AiOutlineCheck } from "react-icons/ai";
import { RiImageLine } from "react-icons/ri";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../../../../context/AuthContext";
import useUserProfileSettings from "../../../../../hooks/useUserProfileSettings";
import DashboardItem from "./DashboardItem/DashboardItem";

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
		<div className="userProfileSettings">
			<div className="userProfileSettings__title">Моя учётная запись</div>
			<div className="userProfileSettings__UserDashboard user-dashboard">
				<div className="user-dashboard__color"></div>
				<div className="user-dashboard__info userInfo-dashboard">
					<div className="userInfo-dashboard__image">
						{img && 
							<div className="userInfo-dashboard__accept">
								<div className="userInfo-dashboard__acceptButton" onClick={handleSend}>
									<AiOutlineCheck color="#000" size={20}/>
								</div>
							</div>
						}
						<input required style={{ display: "none" }} type="file" id="file" 
							onChange={(e) => {
								if(e.target.files){
									setImg(e.target.files[0])
								}
						}}/>
						<label className="userInfo-image__input" htmlFor="file">
							<RiImageLine size={30} color="white"/>
						</label>
						{currentUser.currentUser?.photoURL && <img loading="lazy" src={currentUser.currentUser?.photoURL} alt=""/>}
					</div>
					<div className="userInfo-dashboard__name">
					{currentUser.currentUser?.name && currentUser.currentUser?.name} 
					<span> {"#" + currentUser.currentUser?.uid.slice(0, 4) + "..."} </span>
					</div>
					<div className="userInfo-dashboard__buttonWrapper">
						<div className="userInfo-dashboard__button">Редактировать профиль пользователя</div>
					</div>
				</div>
				<div className="user-dashboard__data userData-dashboard">
					<div className="userData-dashboard">
						<DashboardItem title="имя пользователя" text={currentUser.currentUser?.name + "#" + currentUser.currentUser?.uid.slice(0, 4) + "..."} buttonText="изменить" />
						<DashboardItem title="электронная почта" text={currentUser.currentUser?.email} buttonText="изменить" />
						<DashboardItem title="номер телефона" text="foo" buttonText="добавить" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfileSettings