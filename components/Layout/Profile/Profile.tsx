import { ReactElement, useContext } from "react"
import { BsDiscord } from "react-icons/bs"
import { TbSettingsFilled } from "react-icons/tb"
import { AuthContext } from "../../../context/AuthContext"
import useSettings from "../../../hooks/useSettings"

interface ProfileProps {
	img?: ReactElement
	name?: string
	id?: string
}

const Profile: React.FC<ProfileProps> = ({img, name, id}) => {
	
  const userContext = useContext(AuthContext)
  const settingsContext = useSettings()

	return (
		<div className="profile__content">
			<div className="user__content">
				<div className="user__logo">
					{!img ? <BsDiscord size={22} color='white'/> : img }
				</div>
				<div className="user__info">
					<div className="user__name">{userContext.currentUser?.name}</div>
					<div className="user__id">{userContext.currentUser?.uid}</div>
				</div>
			</div>
			<div className="profile__button" onClick={settingsContext.onOpen}>
				<TbSettingsFilled size={20}/>
			</div>
		</div>
	)
}

export default Profile