"use client";
import Image from 'next/image'
import NavLink from './NavLink';
import { useState } from 'react';

const MenuDropDown = () => {
    const src: string = "/icons/navBar/avatar.svg";

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <>
          <div className='grid md:hidden place-content-center h-[55px] w-[56px] hover:bg-light-gray'>
          <button className='' onClick={() => setIsOpen(!isOpen)}>
            {isOpen &&  <Image src={'/icons/navBar/x.svg'} alt={"user image"} width={28} height={28} />}
            {!isOpen && <Image src={'/icons/navBar/menu.svg'} alt={"user image"} width={28} height={28} />}
          </button>
          </div>
          {
              isOpen && (<div className='flex md:hidden flex-col justify-around  absolute top-[56px] right-0 w-[56px] '>
                            <NavLink route={'/home'} src={'/icons/navBar/home.svg'} alt={'home'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/leaderboard'} src={'/icons/navBar/leaderboard.svg'} alt={'leaderboard'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/game'} src={'/icons/navBar/game.svg'} alt={'game'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/chat'} src={'/icons/navBar/chat.svg'} alt={'chat'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/profile'} src={src} alt={'profile'} setIsOpen={setIsOpen}/>
                            <NavLink route={'/settings'} src={'/icons/navBar/settings.svg'} alt={'settings'} setIsOpen={setIsOpen} />
                            <NavLink route={'/'} src={'/icons/navBar/logout.svg'} alt={'logout'} setIsOpen={setIsOpen}/>  
                        </div>)
          }
      </>
    )
}

export default MenuDropDown