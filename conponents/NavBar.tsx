import React from 'react' 
import Image from 'next/image'
import { useRouter } from "next/router";
import Link from "next/link";

const NavLink = ({route, src, alt}: {route: string, src: string, alt: string,}) => {
  // const router = useRouter();
  // const currentRoute = router.pathname;
  return (
      <Link href={route}>
        <Image className='inline' src={src} alt={alt} width={28} height={28} />
      </Link>
  )
}

const Left = () => {
  return (
    <div className='inline'>
      <Image 
        src="/img/website_logo.svg" 
        alt="logo"
        width={128}
        height={28}
      />
    </div>
  )
}

const Mid = () =>{
  const navigationRoutes = ["home", "leaderbord", "game", "chat"];
  return (
    <div className=''>
        <NavLink route={navigationRoutes[0]} src={'/icons/home.svg'} alt={navigationRoutes[0]} />
        <NavLink route={navigationRoutes[1]} src={'/icons/leaderboard.svg'} alt={navigationRoutes[1]} />
        <NavLink route={navigationRoutes[2]} src={'/icons/game.svg'} alt={navigationRoutes[2]} />
    </div>
  )
}

const Right = () =>{
  return (
    <div className='inline'>
        <Image src={'/icons/home.svg'} alt="home" width={28} height={28} />
    </div>
  )
}

const NavBar = () => {
  return (
      <nav className="flex justify-between p-[14px] bg-dark-gray border-b border-blue">
        <Left />
        <Mid />
        <Right />
      </nav>
  )
}

export default NavBar;