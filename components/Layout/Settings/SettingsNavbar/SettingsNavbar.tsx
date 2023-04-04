import { AiOutlineCloseCircle } from "react-icons/ai"
import useSettings from "../../../../hooks/useSettings"

const SettingsNavbar = () => {

  const settingsContext = useSettings()

	return (
		<div className="settingsNavbar__container">
			<div className="settingsNavbar__button settingsNavbar-button">
				<AiOutlineCloseCircle
				 color="#b5bac1" 
				 size={36}
				 style={{cursor:'pointer'}}
				 onClick={settingsContext.onClose}
				/>
				ESC
			</div>
		</div>
	)
}

export default SettingsNavbar