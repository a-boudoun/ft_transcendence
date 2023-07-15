"use client";
import {useEffect, useState, ReactNode } from 'react';

import Title from './Title';

interface UserDetailsProps {
    Stats : ReactNode;
    Archievement : ReactNode;
    Matches : ReactNode;
    Friends : ReactNode;
}

const UserDetails = (props : UserDetailsProps) => {

    const [Stats, setStats] = useState<boolean>(true);
    const [achievements, setAchievements] = useState<boolean>(false);
    const [matches, setMatches] = useState<boolean>(false);
    const [friends, setFriends] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1020) {
                setFriends(false);
            }
            if (window.innerWidth > 1280) {
                setStats(true);
                setAchievements(false);
                setMatches(false);
                setFriends(false);
            }
        }

        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
    return (
        <div className='grow flex flex-col overflow-hidden xl:w-auto'>
            <div className='h-[56px] flex justify-around bg-dark-gray sm:mt-8 sm:rounded-t-3xl xl:bg-light-gray'>
                <button onClick={() => {setStats(true); setAchievements(false); setMatches(false); setFriends(false);}}>
                    <Title isActive={Stats} str='Stats' src='/icons/profile/stats.svg'/>
                </button>
                <button className='xl:hidden' onClick={() => {setStats(false); setAchievements(true); setMatches(false); setFriends(false);}}>
                    <Title isActive={achievements} str='Achievements' src='/icons/profile/achievements.svg'/>
                </button>
                <button className='xl:hidden' onClick={() => {setStats(false); setAchievements(false); setMatches(true); setFriends(false);}}>
                    <Title  isActive={matches} str='Matches' src='/icons/profile/matches.svg'/>
                </button>
                <button className='lg:hidden' onClick={() => {setStats(false); setAchievements(false); setMatches(false); setFriends(true);}}>
                    <Title isActive={friends} str='' src='/icons/profile/friends.svg'/>
                </button>
            </div>
            <div className='grow p-4 bg-light-gray  overflow-auto sm:rounded-b-3xl' >
                { Stats && props.Stats}
                { achievements && props.Archievement}
                { matches && props.Matches}
                { friends && props.Friends}
            </div>
        </div>
    )       
}  

export default UserDetails;