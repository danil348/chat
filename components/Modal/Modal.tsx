import React, { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button/Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  text?: string;
  body?:  React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, onSubmit, title, text, body, actionLabel, disabled, footer}) => {

  const handleClose = useCallback(() => {
    if(disabled == true){
      return
    }

    onClose()
  }, [disabled, onClose])

  const handleSubmit = useCallback(() => {
    if(disabled == true){
      return
    }

    onSubmit()
  }, [disabled, onSubmit])

  if(isOpen == false){
    return null
  }

  return (
    <>
      <div className="form__wrapper">
        <div className="form__container">
          <button onClick={handleClose} disabled={disabled} className="form__closeButton">
            <AiOutlineClose size={22} color="white" />
          </button>
          <p className="form__title">{title}</p>
          <p className="form__text">{text}</p>
          <form action="" className="form__body">
            {body}
            <Button disabled={disabled} label={actionLabel} onClick={handleSubmit} />
          </form>
          {footer}
        </div>
      </div>
    </>
  )
}

export default Modal