import React from "react";
import { TiWarning } from "react-icons/ti";


interface InputProps {
	placeholder?: string;
	value?: string;
	type?: string;
	disabled?: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label?: boolean;
	labelContent?: string;
	id?: string;
	warning?: boolean;
}

const Input: React.FC<InputProps> = ({placeholder, value, type, disabled, onChange, label, labelContent, id, warning}) => {
	return (
		<div className="input__wrapper">
			{label && <p className="input__label" style={{ textTransform: 'uppercase'}}>
				{labelContent} 
				{warning && <TiWarning size={15} color="red" /> }</p>}
			<input 
				type={type}
				placeholder={placeholder}
				value={value}
				disabled={disabled}
				onChange={onChange}
				id={id}
			/>
		</div>
	)
}

export default Input