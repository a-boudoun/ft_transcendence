"use client";

import AccountDropDown from './AccountDropDown';
import Image from 'next/image'
import NavLink from './NavLink';
import { useState } from 'react';

const MenuDropDown = () => {
    const src: string = "/icons/avatar.svg";

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <>
          <button className='grid md:hidden place-content-center mr-[14px]' onClick={() => setIsOpen(!isOpen)}>
            {isOpen &&  <Image src={'/icons/x.svg'} alt={"user image"} width={28} height={28} />}
            {!isOpen && <Image src={'/icons/menu.svg'} alt={"user image"} width={28} height={28} />}
          </button>
          {
              isOpen && (<div className='flex flex-col justify-around  absolute top-[56px] right-0 w-[56px]'>
                            <NavLink route={'/home'} src={'/icons/home.svg'} alt={'home'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/leaderboard'} src={'/icons/leaderboard.svg'} alt={'leaderboard'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/game'} src={'/icons/game.svg'} alt={'game'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/chat'} src={'/icons/chat.svg'} alt={'chat'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/profile'} src={src} alt={'profile'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/settings'} src={'/icons/settings.svg'} alt={'settings'} setIsOpen={setIsOpen} />
                            <NavLink route={'/'} src={'/icons/logout.svg'} alt={'logout'} setIsOpen={setIsOpen}/>  
                        </div>)
          }
      </>
    )
}

export default MenuDropDown