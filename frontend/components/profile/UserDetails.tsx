"use client";
import { use, useEffect, useState } from 'react';
import MidButtom from './MidBottom';
import Achievements from './Achievements';
import Matches from './Matches';
import Title from './Title';
import Friends from './Friends';

const UserDetails = () => {

    const [Stats, setStats] = useState<boolean>(true);
    const [achievements, setAchievements] = useState<boolean>(false);
    const [matches, setMatches] = useState<boolean>(false);
    const [friends, setFriends] = useState<boolean>(false);

    const chenge = window.addEventListener('resize', ()=> {

        if(window.innerWidth > 1020) {
            setStats(true);
            setAchievements(false);
            setMatches(false);
            setFriends(false);
        }
    })
    
    useEffect( () => { chenge }, []);


    return (
        <div className='grow flex flex-col'>
            <div className='h-[56px] flex justify-around bg-dark-gray sm:mt-8 sm:rounded-t-3xl xl:bg-light-gray'>
                <button onClick={() => {setStats(true); setAchievements(false); setMatches(false); setFriends(false);}}>
                    <Title isActive={Stats} str='Stats' src='/icons/profile/blue/stats.svg'/>
                </button>
                <button className='xl:hidden' onClick={() => {setStats(false); setAchievements(true); setMatches(false); setFriends(false);}}>
                    <Title isActive={achievements} str='Achievements' src='/icons/profile/blue/achievements.svg'/>
                </button>
                <button className='xl:hidden' onClick={() => {setStats(false); setAchievements(false); setMatches(true); setFriends(false);}}>
                    <Title  isActive={matches} str='Matches' src='/icons/profile/blue/matches.svg'/>
                </button>
                <button className='lg:hidden' onClick={() => {setStats(false); setAchievements(false); setMatches(false); setFriends(true);}}>
                    <Title isActive={friends} str='' src='/icons/profile/blue/friends.svg'/>
                </button>
            </div>
            <div className='grow grid content-center bg-light-gray sm:rounded-b-3xl' >
        
            { Stats && <MidButtom/> }
            { achievements && <Achievements/> }
            { matches && <Matches/> }
            { friends && <Friends/> }

            </div>
        </div>
    )       
}  

export default UserDetails;