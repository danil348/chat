import React from "react";

interface SidebarProps {
	content: React.ReactElement;
	profile: React.ReactElement;
}

const Sidebar: React.FC<SidebarProps> = ({content, profile}) => {
	return (
		<div className="sidebar__container">
			{content}
			{profile}
		</div>
	)
}

export default Sidebar