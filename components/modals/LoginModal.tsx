import { useCallback, useState } from "react";
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

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

			//

			loginModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [loginModal])

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
      type="email"
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