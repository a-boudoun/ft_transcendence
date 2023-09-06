import { useEffect, useRef } from 'react';
import { setisopen }  from "../redux/features/globalState";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '@/redux/store';

const useAmiski = () => {
    const dispatch: AppDispatch = useDispatch();
    const divref = useRef<HTMLDivElement>(null);
    const isopen = useSelector((state: any) => state.globalState.isopen);
    useEffect(() => {
  
      const handleClickOutside = (event: any) => {
 
        if (!divref.current) return;
  
        if (!divref.current?.contains(event.target)) {
           if(isopen)
                dispatch(setisopen(!isopen));
      };
  
    }
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  
    }, [isopen])

        return {divref};
}

export default useAmiski;