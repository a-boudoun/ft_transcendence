import Image from 'next/image'

const MidTop = () => {
    const  baner = '/img/baner.webp'
    const  img = '/icons/navBar/avatar.svg'
    const  name = 'mohamed Elazhari'
    const status = 'online';
   
    return(
       <div className='relative'>
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

export default MidTop;