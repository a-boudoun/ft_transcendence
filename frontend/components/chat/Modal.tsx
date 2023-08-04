"use client"
import { useState } from "react";
import { useffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisopen } from "@/redux/features/currentChannel";

function Modal() {

    const dispatch = useDispatch<AppDispatch>();
    const [isBrowser, setIsBrowser] = useState(true)
    const isopen:boolean = useSelector((state: any) => state.currentChannel.isopen);

    const onClick = () => {
        dispatch(setisopen(false));
    }
    return (
     
          <div className={`${isopen === true ? '' : 'hidden'} fixed z-40 inset-0 overflow-y-auto`}>
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-50">
               
              </div>
              <div className="bg-white rounded-lg p-8 text-black h-96 w-96 z-50 ">
                <button className="bg-blue px-4 py-2 rounded-8 cursor-pointer" onClick={onClick}>Click</button>
              </div>
            </div>
          </div>
      
  
    );
  }
  
  export default Modal;
