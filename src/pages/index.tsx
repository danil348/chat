import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import { AuthContext } from "../../context/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import useRegisterModal from "../../hooks/useRegisterModal";

export default function Home() {
  const { getItem } = useLocalStorage();

  const userContext = useContext(AuthContext)

  const registerModal = useRegisterModal()

  useEffect(() => {
    const login = async () => {
      try {
        const _password = getItem('password');
        const _email = getItem('email');

        if (_password && _email) {
          
          const res = await signInWithEmailAndPassword(auth, _email as string, _password as string);
        
          const docRef = doc(db, "users", res.user.uid);
          const docSnap = await getDoc(docRef);

          if(docSnap.data()?.photoURL){
            userContext.setCurrentUser({
              name: docSnap.data()?.username,
              displayName: docSnap.data()?.displayName,
              email: docSnap.data()?.email,
              uid: docSnap.data()?.uid,
              photoURL: docSnap.data()?.photoURL
            })
          }else{
            userContext.setCurrentUser({
              name: docSnap.data()?.username,
              displayName: docSnap.data()?.displayName,
              email: docSnap.data()?.email,
              uid: docSnap.data()?.uid,
            })
          }

          registerModal.onClose()
        }
      } catch (error) {
        console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
      }
    }

    if(registerModal.isOpen){
      login();
    }
  }, []);
  
  return (
    <>
      <RegisterModal/>
      <LoginModal/>
      <Layout/>
    </>
  )
}
