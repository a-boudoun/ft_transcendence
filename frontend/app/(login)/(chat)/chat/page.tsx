"use client";
import React from 'react'
import Image from 'next/image'
import Messeges from '@/components/chat/Messeges';
import Link from 'next/link';
import Mid from '@/components/chat/Mid';
import { usePathname } from 'next/navigation';

const Page = () => {
 
  return (
    <div className={` hidden sm:flex justify-center items-center sm:w-1/2 lg:w-8/12  text-blue  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg`}>
      <span className='text-md md:text-lg'>Select a chat or start a new conversation</span >
    </div>
  );
}
 
export default Page;