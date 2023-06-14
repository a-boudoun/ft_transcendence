import React from 'react'
import Image from 'next/image'
import NavLink from '@/components/NavBar/NavLink'

const MidTop = () => {
 const  baner = '/img/baner.webp'
 const  img = '/icons/navBar/avatar.svg'
 const  name = 'mohamed Elazhari'
 const status = 'online';

 return(
    <div className='relative w-[90%] h-[auto] m-[5%]'>
      <Image className=' w-full h-full'  src={baner} alt='baner' width={1000} height={1000} />
      <div className='absolute flex gap-3 items-center bottom-0 w-full bg-black/70 p-[14px]'> 
        <Image className='rounded-full'  src={img} alt='img' width={68} height={68} />
        <div className='text-left'>
          <h2 className='text-white text-xl'>{name}</h2>
          <div className=''>
            <span className='text-green-500'>{status}</span>
            <button className='bg-blue text-sm px-[14px] ml-[6px] text-black'>add friend </button>
          </div>
        </div>
      </div> 
    </div>
 )
}

const MiniNav = () => {
  const navigationRoutes: string[] = ["stats" , "achievements", "matches", "friends"];

  return (
    <div className='flex justify-between bg-dark-gray'>
        <NavLink route={navigationRoutes[0]} src={'/icons/profileNavBar/stats.svg'} alt={navigationRoutes[0]}/>
        <NavLink route={navigationRoutes[1]} src={'/icons/profileNavBar/achievements.svg'} alt={navigationRoutes[1]} />
        <NavLink route={navigationRoutes[2]} src={'/icons/profileNavBar/matches.svg'} alt={navigationRoutes[2]}/>
        <NavLink route={navigationRoutes[3]} src={'/icons/profileNavBar/friends.svg'} alt={navigationRoutes[3]}/>
    </div>
  )
}

const Mid = () => {
  return(
    <div className='bg-light-gray h-full w-full'>
      <MidTop />
      <MiniNav />
    </div>  
  )
}

const Profile = () => {
  return (
        <>
        <main className="h-screen pt-[56px] bg-light-gray">
            <Mid />
        </main>
        </>
  )
}

export default Profile;