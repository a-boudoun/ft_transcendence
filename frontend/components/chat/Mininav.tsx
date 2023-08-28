// "use client";
import Image from 'next/image'
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Channel from './Channel';
import Friend from './Friend';
const MiniNav = () => {


    // const usepathname = usePathname();
    // console.log(usepathname);
    const isFriend = true;
   
    console.log(isFriend);
    return (
        <>
            <div className=' flex bg-light-gray h-[59px] rounded-md'>
                <div className='flex py-2 justify-between gap-1 items-center w-1/4'>
                    <div className={`box-border h-full py-3 px-2 ${isFriend === true ? 'border-b-2 border-blue' : ''}`}>
                        <Link href={'/chat'} ><Image src={'/img/msgb.svg'} width={22} height={22} alt={''} /></Link>
                    </div>
                    <div className={`box-border h-full py-3 px-2 ${isFriend === false ? 'border-b-2 border-blue' : ''}`}>
                        <Link href={'/channel'}><Image src={'/img/channelb.svg'} width={30} height={22} alt={''} /></Link>
                    </div>
                </div>
                <div className='flex bg-[#fff] my-3 mx-2 w-3/4 px-3 rounded-xl'>
                    <input className='w-full h-full outline-none	' type="text" placeholder='Search' />
                    <Image
                        priority
                        src={'/img/search.svg'}
                        width={27}
                        height={27}
                        alt='search'
                    />
                </div>
            </div>
            {/* <Friend /> */}
            <Channel  />
        </>
    );
}

export default MiniNav;


