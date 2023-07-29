"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';
import { useState } from 'react';


const Right = () => {

    const data = useSelector((state: any) => state.currentChannel.channel);
    const [input, setInput] = useState('');

    const handleChange = (e: any) => {
        setInput(e.target.value);
    }

    return (
          <div className={`hidden lg:flex lg:flex-col lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg rounded-xl`}>
            <Image
              className="h-[150px] w-[150px]  rounded-full p-3 self-center "
              src={data.image}
              width={1000}
              height={1000}
              alt=""/>
            <h2 className='text-blue'>{data.name}</h2>
              <div className='flex bg-[#fff]  px-3 rounded-xl m-4 text-dark-gray'>
                      <input className='w-full h-full outline-none	p-2' type="text" placeholder='Search member' onChange={handleChange} />
                      <Image
                          priority
                          src={'/img/search.svg'}
                          width={27}
                          height={27}
                          alt='search'
                      />
                      
                </div>
                <div className={`h-48  bg-dark-gray mx-2 rounded-lg bg-opacity-80 ${input.length === 0 ? 'hidden' : ''}`}>

                </div>

     
          </div>
      )
  }


export default Right;