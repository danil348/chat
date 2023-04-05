import React from "react"

interface DashboardItemProps {
	title?: string
	text?: string
	buttonText?: string
}

const DashboardItem: React.FC<DashboardItemProps> = ({title, text, buttonText}) => {
	return (
		<div className="userData-dashboard__item dashboard-item">
			<div className="dashboard-item__info">
				<div className="dashboard-item__title">{title}</div>
					<div className="dashboard-item__text">{text}</div>
				</div>
			<div className="dashboard-item__button">{buttonText}</div>
		</div>
	)
}

export default DashboardItem