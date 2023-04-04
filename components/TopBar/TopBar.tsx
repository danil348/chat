import { useContext } from "react";
import { TbAt } from "react-icons/tb";
import { ChatContext } from "../../context/ChatContext";

interface TopBarProps {
	profile?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({profile}) => {
	
  const { state } = useContext(ChatContext);
	
	return (
		<div className="topBar__container">
			{profile && 
				<div className="topBar__profile">
					{state.user?.displayName && <TbAt color="#909090" size={25}/>}
					<div className="topBar__userName">{state.user?.displayName}</div>
				</div>
			}
		</div>
	)
}

export default TopBar