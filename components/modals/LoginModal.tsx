import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
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

  const userContext = useContext(AuthContext)

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

      const res = await signInWithEmailAndPassword(auth, email, password);

      userContext.setCurrentUser({
        name: res.user.displayName,
        email: res.user.email,
        uid: res.user.uid
      })

			loginModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [email, loginModal, password, userContext])

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