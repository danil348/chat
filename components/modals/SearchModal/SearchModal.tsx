import { db } from "@/firebase";
import { DocumentData, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useSearchModal from "../../../hooks/useSearchModal";
import Search from "../../Layout/Search/Search";

const SearchModal = () => {

  const searchModal = useSearchModal()
  const userContext = useContext(AuthContext)

	const [value, setValue] = useState<string>('')
	const [user, setUser] = useState<DocumentData>({})
	const [err, setErr] = useState(false);
	
	if(searchModal.isOpen == false){
		return;
	}
	
	const handleSearch = async () => {
		const q = query(
      collection(db, "users"),
      where("username", "==", value)
    );

		try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
	}

	const handleKey = (e: React.KeyboardEvent) => {
		if(e.code == "Enter"){
			handleSearch()
		}
	}

	const handleSelect = async () => {
		const combinedId = userContext.currentUser?.uid > user?.uid ? 
		userContext.currentUser?.uid + user?.uid : user?.uid + userContext.currentUser?.uid;
		
		try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists() && user) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
				
        await updateDoc(doc(db, "userChats", userContext.currentUser?.uid), {
          [combinedId + ".userInfo"]: {
            uid: user?.uid,
            displayName: user?.username
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
				
				await updateDoc(doc(db, "userChats", user?.uid as any), {
          [combinedId + ".userInfo"]: {
            uid: userContext.currentUser?.uid,
            displayName: userContext.currentUser?.name
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
				
        setUser({});
    		setValue("")
      }
    } catch (err) {}
	}

	return (
		<div className="searchModal__wrapper">
			<div className="searchModal__actions" onClick={() => {searchModal.onClose()}}></div>
			<div className="searchModal__content">
				<div className="searchModal__title">Поиск ЛС</div>
				<div className="searchModal__window">
					<Search placeholder="Найти беседу" onChange={(e) => {
							setValue(e.target.value)
							setErr(false)
						}}
						 onKeyDown={(e) => handleKey(e)} 
						 />
					{user && 	<div className="" onClick={handleSelect} >{user.username}</div>}
					{!err && <div className="searchModal__text"><span>ПОДСКАЗКА:</span>Введите имя пользователя и нажмите <span>Enter</span></div>}
				</div>
			</div>
		</div>
	)
}

export default SearchModal