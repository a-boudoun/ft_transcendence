"use client";
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react';
import Channel from './Channel';
import Friend from './Friend';
import { useParams, usePathname } from 'next/navigation'
const Left = () => {


   
    const isFriend = usePathname().slice(0, 5) === '/chat' ? true : false;
    const ischild = useParams().id ? true : false;
    console.log(isFriend);
    return (
        <div className={`h-full w-full ${ischild === true ? 'hidden': ''} md:block md:w-1/2  lg:w-4/12  sm:mx-6  sm:rounded-[2.5rem] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:p-4  grow`}>
            <Channel />
        </div>
    );
}

export default Left;


