import getData from "@/apis/getData";
import userDto from "@/dto/userDto";

const Stats = async() => {

  const data: userDto = await getData('http://loaclhost:8000/users/getUser');


    const games = '100';
    const win = '50%';
    const lose = '50%';
    const rank = '#5';
  
  
    return(
      <div className='grid grid-cols-2 content-center w-[90%] capitalize m-[5%] xl:z-40'>
        <div className='stats-div-mobile'>
          <span className='font-bold text-lg'>{games}</span>
          <h3 className='text-blue'>total games</h3>
        </div>
        <div className='stats-div-mobile '>
          <span  className='font-bold text-lg'>{win}</span>
          <h3 className='text-blue'>win</h3>
        </div>
        <div className='stats-div-mobile'>
          <span  className='font-bold text-lg'>{lose}</span>
          <h3 className='text-blue'>lose</h3>
        </div>
        <div className='stats-div-mobile'>
          <span className='font-bold text-lg' >{data.XP}</span>
          <h3 className='text-blue'>xp</h3>
        </div>
        <div className='stats-div-mobile'>
          <span className='font-bold text-lg' >{data.level}</span>
          <h3 className='text-blue'>level</h3>
        </div>
        <div className='stats-div-mobile'>
          <span className='font-bold text-lg'>{rank}</span>
          <h3 className='text-blue' >rank</h3>
        </div>
      </div>
    )
  }

export default Stats;