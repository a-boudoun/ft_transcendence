"user client";

import React from 'react'
import Image from 'next/image'
import NavLink from './NavLink';
import { useState, useEffect } from 'react';
import useCloseOutSide from '@/hookes/useCloseOutSide';

interface Props {
  src: string;
  setIsOpen: (isOpen: boolean) => void;
}

function DropDown({src, setIsOpen}: Props) {

  const {divref} = useCloseOutSide({setIsOpen});

  return (
    <div
      ref={divref}
      className='hidden md:flex flex-col justify-around  absolute top-[56px] right-0 w-[56px] h-[160px]'
    >
                          <NavLink route={'/profile'} src={src} alt={'profile'} setIsOpen={setIsOpen}/>
                          {/* <button className='grid place-content-center h-[55px] w-[56px] hover:bg-light-gray' onClick={ () => setIsSettingsOpen(!isSettingsOpen)}>
                            <Image src={'/icons/navBar/settings.svg'} alt={'settings'} width={28} height={28} /> 
                          </button> */}
                          <NavLink route={'/settings'} src={'/icons/navBar/settings.svg'} alt={'settings'} setIsOpen={setIsOpen}/>
                          <NavLink route={'/'} src={'/icons/navBar/logout.svg'} alt={'logout'} setIsOpen={setIsOpen}/>
                      </div>
  )
}

const AccountDropDown = () => {

  const src: string = "/icons/navBar/avatar.svg";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);



  return (
    <>
        <button className='hidden md:grid place-content-center mr-[14px]' onClick={() => setIsOpen(!isOpen)}>
          {isOpen &&  <Image src={'/icons/navBar/x.svg'} alt={"user image"} width={28} height={28} />}
          {!isOpen && <Image src={src} alt={"user image"} width={28} height={28} />}
        </button>
        {
            isOpen && <DropDown src={src} setIsOpen={setIsOpen}/>
        }
        {/* {
          isSettingsOpen && <Settings/>
        } */}

    </>
  )
}

export default AccountDropDown