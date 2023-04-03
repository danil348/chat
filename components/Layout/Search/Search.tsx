interface SearchProps {
	placeholder?: string
	type?: string
	value?: string
	disabled?: boolean
	onKeyDown: (event: React.KeyboardEvent) => void;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({placeholder, type, value, disabled, onChange, onKeyDown}) => {
	return (
		<div className="search__wrapper">
			<input 
				type={type}
				placeholder={placeholder}
				value={value}
				disabled={disabled}
        onChange={onChange}
				onKeyDown={onKeyDown}
			/>
		</div>
	)
}

export default Search