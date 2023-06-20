import Image from 'next/image'

const User = () => {
    const  baner = '/img/baner.webp'
    const  img = '/icons/navBar/avatar.svg'
    const  name = 'mohamed Elazhari'
    const status = 'online';
   
    return(
       <div className='relative sm:rounded-3xl overflow-hidden'>
         <Image className='w-full h-full'  src={baner} alt='baner' width={1000} height={1000} />
         <div className='absolute flex gap-3 items-center bottom-0 w-full bg-black/70 p-[14px]'> 
           <Image className='rounded-full sm:w-[86px] sm:m-4'  src={img} alt='img' width={68} height={68} />
           <div className='text-left'>
             <h2 className='text-white text-xl sm:text-3xl'>{name}</h2>
             <div className=''>
               <span className='text-green-500 sm:text-xl'>{status}</span>
               <button className='bg-blue text-sm px-4 py-[2px] ml-4 text-black'>add friend </button>
             </div>
           </div>
         </div> 
       </div>
    )
}

export default User;