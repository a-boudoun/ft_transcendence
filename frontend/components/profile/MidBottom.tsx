"use client";

import PercentageCircle from "./PercentageCircle";
import PercentageLine from "./PercentageLine";

const Stats = ({user} : {user : any}) => {

  const games = user.wins + user.loses;

    return(
      <div className='h-full flex flex-col justify-center gap-20 xl:z-40'>
        <div className="w-full flex flex-col gap-4 p-4">
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
            <span className='font-bold text-3xl'>{games}</span>
            <h3 className='text-blue text-lg'>Total games</h3>
          </div>
          <div className="w-full flex justify-around">
            <div className="max-w-[120px] sm:max-w-[200px] flex flex-col gap-2">
                <PercentageCircle value={user.wins} percentage={games ? (user.wins / games) * 100 : 0} color={'#7AC7C4'} />
                <h3 className='text-blue'>Wins</h3>
              </div>
            <div className="flex flex-col gap-2">
              <PercentageCircle value={user.loses} percentage={games ? (user.loses / games) * 100 : 0} color={'#EA5581'}/>
              <h3 className='text-red'>Loses</h3>
            </div>
          </div>
        </div>
      </div>
    )

}

export default Stats;