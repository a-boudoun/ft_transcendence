"use client";
import React from 'react'
import Image from 'next/image'
import Messeges from '@/components/chat/ChannelItems';
import Link from 'next/link';
import Mid from '@/components/chat/Mid';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Modal from '@/components/chat/Modal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisChild } from '@/redux/features/globalState';
import { useEffect } from 'react';

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(setisChild(false));
  }, []);
  return (
    <div className={` hidden md:flex justify-center items-center md:w-1/2 lg:w-8/12  text-white  rounded-[2.5rem]  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4`}>
      <div className='w-full h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-[2rem] flex justify-center items-center'>

      <span className='text-md md:text-lg text-blue'>Select a chat or start a new conversation </span>
      </div>
    </div>
  );
}
 
export default Page;