"use client"

import React from 'react' 
import Image from 'next/image'
import NotifDropDown from './FriendRequest';
import MenuDropDown from './MenuDropDown';
import AccountDropDown from './AccountDropDown';
import NavLink from './NavLink';
import GlobalSearch from './GlobalSearch';

const Left = () => {
  return (
    <div className='ml-[1rem] flex items-center'>
      <Image
        src="/img/website_logo.svg" 
        alt="logo"
        width={128}
        height={28}
      />
      <div className="hidden md:block w-72">
        <GlobalSearch />
      </div>
    </div>
  )
}

const Mid = () =>{

  const navigationRoutes: string[] = ["./home", "./leaderboard", "./game", "./chat"];

  return (
    <div className='hidden md:basis-1/3 md:flex md:justify-between'>
        <NavLink route={navigationRoutes[0]} src={'/icons/navBar/home.svg'} alt={navigationRoutes[0]}/>
        <NavLink route={navigationRoutes[1]} src={'/icons/navBar/leaderboard.svg'} alt={navigationRoutes[1]} />
        <NavLink route={navigationRoutes[2]} src={'/icons/navBar/game.svg'} alt={navigationRoutes[2]}/>
        <NavLink route={navigationRoutes[3]} src={'/icons/navBar/chat.svg'} alt={navigationRoutes[3]}/>
    </div>
  )
}

const Right = () =>{
  const userPhoto: string = "avatar.svg"; 
  return (
    <div className='flex' >
      <NotifDropDown />
      <AccountDropDown />
      <MenuDropDown />
    </div> 
  )
}

const NavBar = () => {
  return (
      <nav className="fixed flex justify-between items-center h-[56px] w-screen border-b border-blue z-30">
        <Left />
        <Mid />
        <Right/>
      </nav>
  )
}

export default NavBar;