"use client";

import NavLink from "./NavLink";
import Image from "next/image";
import { useState } from "react";


const NotifDropDown = () => {

  const src: string = "/icons/avatar.svg";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
        <button className='grid place-content-center mr-[14px]' onClick={() => setIsOpen(!isOpen)}>
         <Image src={'/icons/navBar/notification.svg'} alt={"notification"} width={28} height={28} />
        </button>
        {
            isOpen
        }
    </>
  )
}

export default NotifDropDown;
