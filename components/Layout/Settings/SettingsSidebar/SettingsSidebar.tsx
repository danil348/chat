import useUserProfileSettings from "../../../../hooks/useUserProfileSettings"
import SettingsSidebarItem from "./SettingsSidebarItem/SettingsSidebarItem"

const SettingsSidebar = () => {

  const userProfileSettings = useUserProfileSettings()
	
	const userSettings = (
		<>
			<div className="settingsSidebar__title">настройки пользователя</div>
			<SettingsSidebarItem 
				text="Моя учётная запись"
				isOpen={userProfileSettings.isOpen}
				onClick={() => {
					userProfileSettings.onOpen()
				}}
			/>
			<SettingsSidebarItem 
			text="тест"
			isOpen={false}
			onClick={() => {
				userProfileSettings.onClose()
			}}
		/>
		</>
	)

	return (
		<div className="settingsSidebar__container">
			<div className="settingsSidebar__wrapper">
				{userSettings}
			</div>
		</div>
	)
}

export default SettingsSidebar