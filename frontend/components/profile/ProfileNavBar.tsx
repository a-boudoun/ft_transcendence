'use client';

import NavLink from "../NavBar/NavLink";
import { useEffect, useRef, useState } from "react";

const profileNavBar = () => {
    const navigationRoutes: string[] = ["stats" , "achievements", "matches", "friends"];

    const [fixed, setFixed] = useState<boolean>(false);

    const elem = useRef(null);



    useEffect(() => {
      console.log('useEffect');

      const onScroll = (event: any) => {

        if (window.scrollY > 293)
        {
          setFixed(true)
          return;
        }

        setFixed(false)
      }
      
      window.addEventListener("scroll", onScroll);
    }, []);
    return (
      <div className={`${fixed ? 'fixed w-full' : 'sticky'} top-[56px] flex justify-between bg-dark-gray`}>
          <NavLink route={navigationRoutes[0]} src={'/icons/profileNavBar/red/stats.svg'} alt={navigationRoutes[0]}/>
          <NavLink route={navigationRoutes[1]} src={'/icons/profileNavBar/red/achievements.svg'} alt={navigationRoutes[1]} />
          <NavLink route={navigationRoutes[2]} src={'/icons/profileNavBar/red/matches.svg'} alt={navigationRoutes[2]}/>
          <NavLink route={navigationRoutes[3]} src={'/icons/profileNavBar/red/friends.svg'} alt={navigationRoutes[3]}/>
      </div>
    )
  }

export default profileNavBar;