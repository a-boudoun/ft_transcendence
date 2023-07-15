import Image from 'next/image'
import userDto  from '@/dto/userDto'
import getData from '@/apis/server/get'

const User = async({id} : {id : string | null}) => {

  let endpoint = '/users/me';

  if (id)
    endpoint = `/users/${id}`;

  const data: userDto = await getData(endpoint);


  const  baner = '/img/baner.webp'
  const status = 'online';
   
    return(
       <div className='relative overflow-hidden sm:rounded-3xl sm:shadow-2xl'>
         <Image className='w-full h-full'  src={baner} alt='baner' width={1000} height={1000} />
         <div className='absolute flex gap-3 items-center bottom-0 w-full bg-black/70 p-[14px]'> 
           <Image className='rounded-full w-[86px] h-[86px] sm:m-4'  src={data.image} alt='img' width={1000} height={1000} />
           <div className='text-left'>
             <h2 className='text-white text-xl sm:text-3xl'>{data.name}</h2>
              {id &&
                <div className=''>
                <span className='text-green-500 sm:text-xl'>{status}</span>
                <button className='bg-blue text-sm px-4 py-[2px] ml-4 text-black'>add friend </button>
                </div>
              }
           </div>
         </div> 
       </div>
    )
}

export default User;