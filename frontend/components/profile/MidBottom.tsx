"use client";

import { useSelector } from "react-redux";
import PercentageCircle from "./PercentageCircle";
import PercentageLine from "./PercentageLine";

const Stats = ({id} : {id : string | null}) => {

  const user = useSelector((state: any) => state.currentChannel.visitedUser);

  const games  = 100;
  const wins =  (50 * 100) / 100;
  const loses =  (50 * 100) / 100;
  const lvl = 5.5;
  const xp = 2500;
  const rank = 1;
  
    return(
      <div className='h-full flex flex-col justify-center gap-20 xl:z-40 '>
        <div className="w-full flex flex-col gap-4">
          <PercentageLine  value={user.level}/>
          <div className="flex justify-center gap-4">
            <h3 className='text-blue text-lg'>Level</h3>
            <span className='font-bold text-lg'>{user.level}</span>
            <h3 className='text-blue text-lg'>Xp</h3>
            <span className='font-bold text-lg'>{user.XP}</span>
          </div>
        </div>
        <div>
          <div className=''>
            <span className='font-bold text-3xl'>{user.wins + user.loses}</span>
            <h3 className='text-blue text-lg'>Total games</h3>
          </div>
          <div className="w-full flex justify-around">
            <div className="max-w-[120px] sm:max-w-[200px] flex flex-col gap-2">
                <PercentageCircle percentage={user.wins} color={'#7AC7C4'} />
                <h3 className='text-blue'>Wins</h3>
              </div>
            <div className="flex flex-col gap-2">
              <PercentageCircle percentage={user.loses} color={'#EA5581'}/>
              <h3 className='text-red'>Loses</h3>
            </div>
          </div>
        </div>
        {/* <div className=''>
            <span className='font-bold text-3xl'>#{rank}</span>
            <h3 className='text-blue text-lg'>rank</h3>
          </div> */}
      </div>
    )
  }

export default Stats;