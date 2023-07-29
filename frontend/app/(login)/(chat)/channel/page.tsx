"use client";
import React from 'react'
import Image from 'next/image'
import Messeges from '@/components/chat/ChannelItems';
import Link from 'next/link';
import Mid from '@/components/chat/Mid';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

const Page = () => {
  const data = useSelector((state: any) => state.currentChannel.channels);
 
  return (
    <div className={` hidden sm:flex justify-center items-center sm:w-1/2 lg:w-8/12  text-white  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg`}>
      <span className='text-md md:text-lg text-blue'>Select a chat or start a new conversation {data.length}</span>
    </div>
  );
}
 
export default Page;