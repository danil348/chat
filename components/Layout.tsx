import React from 'react';

interface ILayout { 
	children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({children}) => {
	return (
		<div className="">
			Layout
		</div>
	)
}

export default Layout