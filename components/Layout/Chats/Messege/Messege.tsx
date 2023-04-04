import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../../context/AuthContext";

const Message = ({ message } : any) => {

  const { currentUser } = useContext(AuthContext);
	
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

	return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <span>just now</span>
      </div>
      <div className="messageContent">
				<p>{message.senderId}</p>
        <p>{message.text}</p>
      </div>



			<div className="messageContent">
        {message.img && <img src={message.img} alt="" />}
      </div>

		
    </div>

		
  );
};

export default Message;