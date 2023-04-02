import { useCallback, useState } from "react";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";

const RegisterModal = () => {

  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true)

			//

			registerModal.onClose()
		} catch (error) {
			console.log("🚀 ~ file: LoginModal.tsx:16 ~ onSubmit ~ error:", error)
		} finally {
			setIsLoading(false)
		}
	}, [registerModal])

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