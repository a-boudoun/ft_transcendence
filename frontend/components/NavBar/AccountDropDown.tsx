"user client";

import React from 'react'
import Image from 'next/image'
import NavLink from './NavLink';

import { useState } from 'react';


const AccountDropDown = () => {

  const src: string = "/icons/avatar.svg";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
        <button className='hidden md:grid place-content-center mr-[14px]' onClick={() => setIsOpen(!isOpen)}>
          {isOpen &&  <Image src={'/icons/x.svg'} alt={"user image"} width={28} height={28} />}
          {!isOpen && <Image src={src} alt={"user image"} width={28} height={28} />}
        </button>
        {
            isOpen && (<div className='hidden md:flex flex-col justify-around  absolute top-[56px] right-0 w-[56px] h-[160px]'>
                          <NavLink route={'/profile'} src={src} alt={'profile'} setIsOpen={setIsOpen}/>
                          <NavLink route={'/settings'} src={'/icons/settings.svg'} alt={'settings'} setIsOpen={setIsOpen} />
                          <NavLink route={'/'} src={'/icons/logout.svg'} alt={'logout'} setIsOpen={setIsOpen}/>
                      </div>)
        }
    </>
  )
}

export default AccountDropDown