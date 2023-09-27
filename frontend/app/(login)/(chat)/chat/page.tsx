"use client";
import React from 'react'

const Page = () => {
  return (
    <div className={` hidden md:flex justify-center items-center md:w-1/2 lg:w-8/12  text-white  rounded-[2.5rem]  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4`}>
    <div className='w-full h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-[2rem] flex justify-center items-center'>

    <span className='text-md md:text-lg text-blue'>Select a chat or start a new conversation </span>
    </div>
  </div>
  );
}
 
export default Page;
