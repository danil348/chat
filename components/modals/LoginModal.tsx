import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";

const LoginModal = () => {

  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setItem } = useLocalStorage();
  const { getItem } = useLocalStorage();
  
  const userContext = useContext(AuthContext)

  useEffect(() => {
    const login = async () => {
      const _password = getItem('password');
      const _email = getItem('email');

      if (_password && _email) {
        console.log(_password)
        const res = await signInWithEmailAndPassword(auth, _email as string, _password as string);
      
        userContext.setCurrentUser({
          name: res.user.displayName,
          email: res.user.email,
          uid: res.user.uid
        })

        loginModal.onClose()
      }
    }

    if(loginModal.isOpen){
      login();
    }
  }, [email, getItem, loginModal, password, userContext]);

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

      const res = await signInWithEmailAndPassword(auth, email, password);

      userContext.setCurrentUser({
        name: res.user.displayName,
        email: res.user.email,
        uid: res.user.uid
      })

      setItem('password', password);
      setItem('email', email);

			loginModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [email, loginModal, password, setItem, userContext])

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