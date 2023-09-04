import React from 'react';
import Image from "next/image";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import socket from '../socketG';

interface prop {
  setWon: (val: string) => void;
  setLost: (val: string) => void;
}

export default function Lost({setWon, setLost} : prop){
  socket.on('refresh-page', () => {
    setWon('');
    setLost('');
  });
  const {data, isLoading} = useQuery({
		queryKey: ['user'],
		queryFn: async ()=> {
		  const {data} = await axios.get('http://localhost:8000/users/me', { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
    return (
      <div className='bg-dark-gray flex flex-col gap-8 w-full h-full items-center justify-center '>
        <div className='flex flex-col gap-8 W-[600px] h-[600px] '>
          <h1 className='text-6xl font-bold text-[#fc4f4f]'>You Lost</h1>
          <h1 className='text-2xl font-bold font-serif text-red'>-10xp</h1>
          <div className='flex w-[400px] h-[400px] border-black'>
            <Image width={100} height={100} alt="#" src={data.image} className="h-full w-full rounded-full"/>
          </div>
        </div>
      </div>
    );
  }
};