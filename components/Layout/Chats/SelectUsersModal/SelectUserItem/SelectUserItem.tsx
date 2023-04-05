import React, { useEffect, useState } from "react"
import { AiOutlineCheck } from "react-icons/ai"
import { BsDiscord } from "react-icons/bs"

interface SelectUserItemProps {
	photoURL?: string
	name?: string
	selected?: boolean
} 

const SelectUserItem: React.FC<SelectUserItemProps> = ({photoURL, name, selected}) => {

	return (
		<>
			<div className="sidebar-item__image" >
				{photoURL ? <img loading="lazy" src={photoURL} alt=""/> : <BsDiscord size={20} color='white'/>}
			</div>
			<div className="">{name}</div>
			<div className="sidebar-item__check">
				{selected && <AiOutlineCheck/>} 
			</div>
		</>
	)
}

export default SelectUserItem