"use client";
import Image from 'next/image'
import NavLink from './NavLink';
import { useState } from 'react';
import { Search } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import useCloseOutSide from '@/hookes/useCloseOutSide';

interface Props {
  src: string;
  setIsOpen: (isOpen: boolean) => void;
}

const SearchBarDropDown = () => {
  return (
    <div className='h-14 w-56 absolute right-14 top-14 flex flex-col justify-center bg-dark-gray px-2 rounded-l-xl md:hidden'>
      <GlobalSearch />
    </div>
  )
}

const DropDown = ({src, setIsOpen}: Props) => {
  const {divref} = useCloseOutSide({setIsOpen});
  const [isShearch, setIsSearch] = useState<boolean>(false);

  return (
    <div ref={divref}>
      <div className='flex flex-col justify-around absolute top-14 right-0 w-14 md:hidden'>
        <button className='flex justify-center items-center bg-dark-gray h-[56px] w-[56px] hover:bg-light-gray' onClick={() => setIsSearch(!isShearch)}> 
          <Search size={28} color="#7ac7c4" strokeWidth={1.5} />
        </button>
        <NavLink route={'/home'} src={'/icons/navBar/home.svg'} alt={'home'} setIsOpen={setIsOpen}/>
        <NavLink route={'/leaderboard'} src={'/icons/navBar/leaderboard.svg'} alt={'leaderboard'} setIsOpen={setIsOpen}/>
        <NavLink route={'/game'} src={'/icons/navBar/game.svg'} alt={'game'} setIsOpen={setIsOpen}/>
        <NavLink route={'/chat'} src={'/icons/navBar/chat.svg'} alt={'chat'} setIsOpen={setIsOpen}/>
        <NavLink route={'/profile'} src={src} alt={'profile'} setIsOpen={setIsOpen}/>
        <NavLink route={'/settings'} src={'/icons/navBar/settings.svg'} alt={'settings'} setIsOpen={setIsOpen} />
        <NavLink route={'/'} src={'/icons/navBar/logout.svg'} alt={'logout'} setIsOpen={setIsOpen}/>  
      </div>
      {
        isShearch && <SearchBarDropDown />
      }
    </div>
  )
}

const MenuDropDown = () => {
    const src: string = "/icons/navBar/avatar.svg";
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <>
          <div className='relative grid md:hidden place-content-center h-[55px] w-[56px] hover:bg-light-gray'>
          <button className='' onClick={ () => setIsOpen(!isOpen)}>
            {isOpen &&  <Image src={'/icons/navBar/x.svg'} alt={"user image"} width={28} height={28} />}
            {!isOpen && <Image src={'/icons/navBar/menu.svg'} alt={"user image"} width={28} height={28} />}
          </button>
          </div>
          {
              isOpen &&  <DropDown src={src} setIsOpen={setIsOpen}/>
          } 
      </>
    )
}

export default MenuDropDown;