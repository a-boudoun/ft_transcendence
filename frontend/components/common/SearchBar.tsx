interface Props {
    setIsOpen: (isFocused: boolean) => void;
    setSearchValue: (searchValue: string) => void;
  }
  
const SearchBar = ({ setIsOpen, setSearchValue }: Props) => {
  
    return (
      <input className="h-8 w-full text-sm rounded-xl text-black focus:outline-0 focus:border-[2px] hover:opacity-60" type="text" placeholder="Search" name="search"
      onFocus={() => setIsOpen(true)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} />
    )
}

export default SearchBar;