import React from "react";

interface SidebarProps {
	content: React.ReactElement
	profile: React.ReactElement
	searchInput?: React.ReactElement
}

const Sidebar: React.FC<SidebarProps> = ({content, profile, searchInput}) => {
	return (
		<div className="sidebar__container">
			{searchInput}
			{content}
			{profile}
		</div>
	)
}

export default Sidebar