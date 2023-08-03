"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';
import { useState } from 'react';
import Modal from '@/components/chat/Modal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisopen } from '@/redux/features/currentChannel';


const Right = () => {

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.currentChannel.channel);
  const [input, setInput] = useState('');




  const handleChange = (e: any) => {
    setInput(e.target.value);
  }

  
  const handelClick = () => {
    dispatch(setisopen(true));
  }
  return (
    <div className={`hidden lg:flex lg:flex-col lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg rounded-xl`}>

      <div className="h-fit w-full rounded-xl  my-3 ">
        <Image
          className="h-[150px] w-[150px]  rounded-full mx-auto my-3"
          src={data.image}
          width={1000}
          height={1000}
          alt="" />
        <h1 className='text-center text-white text-xl t'>{data.name}</h1>
        <div className="flex flex-row justify-around px-3">
          
         <button onClick={handelClick}>
          <Image
            className="h-[29px] w-[56px]  rounded-full  my-3 hover:opacity-60"
            src={'/img/add.svg'}
            width={1000}
            height={1000}
            alt="" />
          </button> 
          <Image
            className="h-[29px] w-[56px]  rounded-full my-3 hover:opacity-60"
            src={'/icons/navBar/settings.svg'}
            width={1000}
            height={1000}
            alt="" />
          <Image
            className="h-[29px] w-[56px] rounded-full  my-3 hover:opacity-60 "
            src={'/img/leave.svg'}
            width={1000}
            height={1000}
            alt="" />
        </div>
      </div>
      <div className="h-1/3 w-[96%] m-2 rounded-xl">
        <div className="text-blue flex px-4 text-xl mb-2">Members</div>
        <div>
         
          {data.memberships?.map((member: any) => (
            <Items data={member} />
          ))}
        </div>
      </div>
      <div className="h-1/3 w-[96%]  m-2 bg-blue rounded-xl hidden">

      </div>
      
      {/* <Modal /> */}

    </div>
  )
}


export default Right;


export const Items = ({ data }: { data: any }) => {
  console.log("sd",data);

  return (
    <div className="bg-dark-gray rounded-lg py-1 flex m-1 px-2 flex items-center ">
      <Image
        className="h-[30px] w-[30px]  rounded-full"
        src={data.member?.image}
        width={1000}
        height={1000}
        alt="" />
      <div className="pl-3">
        <div className="  " >{data.member?.name}</div>
        <div className=" text-xs text-red" >{data.title}</div>
      </div>
  
    </div>
  )

}