import React, { useState } from "react"
import { AiOutlineCheck } from "react-icons/ai"
import { BsDiscord } from "react-icons/bs"

interface SelectUserItemProps {
	photoURL?: string
	name?: string
	onChange: (state: boolean, index: number) => void
	index: number
	freeUsersNumber: number
} 

const SelectUserItem: React.FC<SelectUserItemProps> = ({photoURL, name, onChange, index, freeUsersNumber}) => {

	const [selected, setSelected] = useState(false);
	
	const handleChange = (state: boolean, idx: number) => {
    onChange(state, idx)
  }

	return (
		<div className="sidebar__item sidebar-item" onClick={() => {
			if(freeUsersNumber > 0){
				handleChange(!selected, index)
				setSelected(!selected)
			}
		}} >
			<div className="sidebar-item__image" >
				{photoURL ? <img loading="lazy" src={photoURL} alt=""/> : <BsDiscord size={20} color='white'/>}
			</div>
			<div className="">{name}</div>
			<div className="sidebar-item__check">
				{selected && <AiOutlineCheck/>} 
			</div>
		</div>
	)
}

export default SelectUserItem