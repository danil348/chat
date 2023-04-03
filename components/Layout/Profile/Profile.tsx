import { useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"

interface ProfileProps {
	img?: React.ReactElement
	name?: string
	id?: string
}

const Profile: React.FC<ProfileProps> = ({img, name, id}) => {
	
  const userContext = useContext(AuthContext)

	return (
		<div className="profile__content">
			<div className="user__content">
				<div className="user__logo">
					{img}
				</div>
				<div className="user__info">
					<div className="user__name">{userContext.currentUser?.name}</div>
					<div className="user__id">{userContext.currentUser?.uid}</div>
				</div>
			</div>
		</div>
	)
}

export default Profile