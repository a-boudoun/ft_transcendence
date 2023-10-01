import { useEffect, useRef } from 'react';


interface Props {
    setIsOpen: (isOpen: boolean) => void;
}

const useCloseOutSide = ({setIsOpen}: Props) => {
    const divref = useRef<HTMLDivElement>(null);

    useEffect(() => {
  
      const handleClickOutside = (event: any) => {
        if (!divref.current) return;
  
        if (!divref.current.contains(event.target)) {
            setIsOpen(false);
      };
  
    }
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  
    }, [])

    return {divref};
}

export default useCloseOutSide;