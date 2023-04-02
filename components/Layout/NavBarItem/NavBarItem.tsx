import React from "react";

interface NavBarItemProps {
	isOpen?: boolean
	onClick: () => void
	icon?: React.ReactElement
	prompt?: string
}

const NavBarItem: React.FC<NavBarItemProps> = ({isOpen, onClick, icon, prompt}) => {
	return (
		<div className={isOpen ? "layout__navBar-item selected":"layout__navBar-item"} >
					<div className="layout__navBar-button" onClick={onClick} >
						{icon}
					<div className="layout__navBar-prompt">{prompt}</div>
					</div>
				<div className="layout__navBar-selected"></div>
		</div>
	)
}

export default NavBarItem