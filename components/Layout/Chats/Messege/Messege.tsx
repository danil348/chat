import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

const Message = ({ message } : any) => {
  const { currentUser } = useContext(AuthContext);
	
	return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <span>just now</span>
      </div>
      <div className="messageContent">
				<p>{message.senderId}</p>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;