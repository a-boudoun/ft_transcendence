"use client";

import { Search } from 'lucide-react';
import { useMemo } from 'react';
import debouce from "lodash.debounce";
import { useEffect } from 'react';

interface Props {
    setIsOpen?: (isFocused: boolean) => void;
    setSearchValue: (searchValue: string) => void;
}

const SearchBar = ({ setIsOpen, setSearchValue }: Props) => {
  const handelFocus = () => {
    if (setIsOpen != undefined) {
      setIsOpen(true);
    }
  }

  const handleChange = (e: any) => {
      setSearchValue(e.target.value);
  }

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 500);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
      <div className="flex justify-end items-center relative">
        <input className="h-8 w-full text-sm rounded-xl text-black focus:outline-0 focus:border-[2px] hover:opacity-60" type="text" placeholder="Search" name="search"
        onFocus={handelFocus} onChange={debouncedResults} />
        <Search className="absolute right-2" size={24} strokeWidth={3} color="#7ac7c4"  />
      </div>
    )
}

export default SearchBar;