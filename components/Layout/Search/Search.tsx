interface SearchProps {
	placeholder?: string
	type?: string
	value?: string
	disabled?: boolean
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({placeholder, type, value, disabled, onChange}) => {
	return (
		<div className="search__wrapper">
			<input 
				type={type}
				placeholder={placeholder}
				value={value}
				disabled={disabled}
        onChange={onChange}
			/>
		</div>
	)
}

export default Search