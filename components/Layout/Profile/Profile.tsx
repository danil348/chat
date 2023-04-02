interface ProfileProps {
	img?: React.ReactElement
	name?: string
	id?: string
}

const Profile: React.FC<ProfileProps> = ({img, name, id}) => {
	return (
		<div className="profile__content">
			<div className="user__content">
				<div className="user__logo">
					{img}
				</div>
				<div className="user__info">
					<div className="user__name">{name}</div>
					<div className="user__id">{id}</div>
				</div>
			</div>
		</div>
	)
}

export default Profile