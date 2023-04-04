import React from "react"

interface SettingsSidebarItemProps {
	onClick?: () => void
	isOpen?: boolean
	text?: string
}

const SettingsSidebarItem: React.FC<SettingsSidebarItemProps> = ({onClick, isOpen, text}) => {
	return (
		<div 
			className={isOpen ? "settingsSidebar__item selected":"settingsSidebar__item"}
			onClick={onClick}
		>
			{text}
		</div>
	)
}

export default SettingsSidebarItem