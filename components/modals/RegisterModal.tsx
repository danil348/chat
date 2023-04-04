import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useChats from "../../hooks/useChats";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { auth, db } from "../../src/firebase";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";

const RegisterModal = () => {

  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
  const chats = useChats()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const userContext = useContext(AuthContext)
  
  const { setItem } = useLocalStorage();
  const { getItem } = useLocalStorage();
  const { removeItem } = useLocalStorage();

  useEffect(() => {
    const login = async () => {
      try {
        const _password = getItem('password');
        const _email = getItem('email');
        const _photoURl = getItem('photoURL');

        if (_password && _email) {
          
          const res = await signInWithEmailAndPassword(auth, _email as string, _password as string);
        
          if(_photoURl){
            userContext.setCurrentUser({
              name: res.user.displayName,
              email: res.user.email,
              uid: res.user.uid,
              photoURL: _photoURl
            })
          }else{
            userContext.setCurrentUser({
              name: res.user.displayName,
              email: res.user.email,
              uid: res.user.uid
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
  }, [email, getItem, loginModal, password, registerModal, userContext]);

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

      const res = await createUserWithEmailAndPassword(auth, email, password)
      const names = res.user.displayName

      await updateProfile(res.user, {
        displayName: username
      });

      userContext.setCurrentUser({
        name: res.user.displayName,
        email: res.user.email,
        uid: res.user.uid,
        displayName: names,
        photoURL: null
      })
      
      setItem('password', password)
      setItem('email', email)
      removeItem('photoURL')

      chats.onOpen()

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email,
        username
      });
      
      await setDoc(doc(db, "userChats", res.user.uid), {});
      
			registerModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [chats, email, name, password, registerModal, setItem, userContext, username])

  const onToggle = useCallback(() => {
    if(isLoading){
      return
    }

    registerModal.onClose()
    loginModal.onOpen()
  }, [isLoading, loginModal, registerModal])

  const bodyContent = (
    <div className="form__content">
      <Input
        label={true}
        labelContent="адрес электронной почты"
        disabled={isLoading}
        placeholder="" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input 
        label={true}
        labelContent="Имя пользователя"
        disabled={isLoading}
        placeholder="" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Input 
        label={true}
        labelContent="Имя, которое будет доступно всем пользователям"
        disabled={isLoading}
        placeholder="" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input 
        label={true}
        labelContent="пароль"
        disabled={isLoading}
        placeholder="" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  )

  const footerContent = (
    <div className="form__footerContent">
      <p>Уже зарегистрировались?
        <span className="" onClick={onToggle} >
          Войти
        </span>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Создать учётную запись"
      actionLabel="Продолжить"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal