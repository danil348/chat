import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useChats from "../../hooks/useChats";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";

const LoginModal = () => {

  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
  const chats = useChats()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setItem } = useLocalStorage();
  const { getItem } = useLocalStorage();
  
  const userContext = useContext(AuthContext)

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

          loginModal.onClose()
        }
      } catch (error) {
        console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
      }
    }

    if(loginModal.isOpen){
      login();
    }
  }, [email, getItem, loginModal, password, registerModal, userContext]);

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

      const res = await signInWithEmailAndPassword(auth, email, password);

      const docRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(docRef);

      if(docSnap.data()?.photoURL){
        userContext.setCurrentUser({
          name: docSnap.data()?.username,
          email: docSnap.data()?.email,
          uid: docSnap.data()?.uid,
          photoURL: docSnap.data()?.photoURL
        })
      }else{
        userContext.setCurrentUser({
          name: docSnap.data()?.username,
          email: docSnap.data()?.email,
          uid: docSnap.data()?.uid,
        })
      }

      chats.onOpen()
      
      setItem('password', password);
      setItem('email', email);

			loginModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [chats, email, loginModal, password, setItem, userContext])

  const onToggle = useCallback(() => {
    if(isLoading){
      return
    }

    loginModal.onClose()
    registerModal.onOpen()
  }, [isLoading, loginModal, registerModal])

  const bodyContent = (
    <div className="form__content">
      <Input
      label={true}
      warning={true}
      labelContent="адрес электронной почты"
      placeholder=""
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      disabled={isLoading}
      />
      <Input
        label={true}
        warning={true}
        labelContent="Пароль"
        placeholder=""
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
    </div>
  )

  const footerContent = (
    <div className="form__footerContent">
      <p>Нужна учетная запись?
        <span className="" onClick={onToggle} >
          Зарегистрироваться
        </span>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="С возвращением!"
      text="Мы так рады видеть вас снова!"
      actionLabel="Вход"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal