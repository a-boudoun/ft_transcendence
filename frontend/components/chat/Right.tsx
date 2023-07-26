"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';


const Right = () => {

    const data = useSelector((state: any) => state.currentChannel.channel);
    console.log("toto",data); 
    return (
          <div className={`hidden lg:flex lg:flex-col lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl`}>
            <Image
              className="h-fit w-fit rounded-full p-10
              self-center "
              src={data.image}
              width={85}
              height={85}
              alt=""/>
            <h2 className='text-blue'>{data.name}</h2>
            <div>
             
            </div>
          </div>
      )
  }


export default Right;