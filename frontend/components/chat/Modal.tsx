"use client"
import { useState } from "react";
import { useffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisopen } from "@/redux/features/currentChannel";
import Image from "next/image";

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
              <div className=" relative rounded-lg  text-black h-96 w-96 z-50 bg-gray-900 ">
                <button className="absolute left-0  p-2  cursor-pointer" onClick={onClick}>
                  <Image
                    className="h-full rounded-full  "
                    src={'/img/cancel.svg'}
                    width={24}
                    height={24}
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
      
  
    );
  }
  
  export default Modal;

