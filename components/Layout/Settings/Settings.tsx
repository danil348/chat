import useSettings from "../../../hooks/useSettings"
import SettingsContent from "./SettingsContent/SettingsContent"
import SettingsNavbar from "./SettingsNavbar/SettingsNavbar"
import SettingsSidebar from "./SettingsSidebar/SettingsSidebar"

const Settings = () => {

  const settingsContext = useSettings()

	if(settingsContext.isOpen == false){
		return null
	}

	return (
		<div className="settings__container">
			<SettingsSidebar/>
			<SettingsContent/>
			<SettingsNavbar/>
		</div>
	)
}

export default Settings