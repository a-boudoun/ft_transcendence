import React from 'react';
import Image from "next/image";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

export default function Won({winner} : {winner: string}){
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
      <div className='bg-dark-gray flex w-full h-full items-center justify-center '>
        <div className='flex flex-col gap-8 W-[600px] h-[600px] '>
          <h1 className='text-6xl font-bold text-[#4bff60f5] '>You Won</h1>
          <h1 className='text-2xl font-bold font-serif text-teal-600'>+10xp</h1>
          <div className='flex w-[400px] h-[400px] border-black'>
            <Image width={1000} height={1000} alt="#" src={data.image} className="h-full w-full rounded-full"/>
          </div>
        </div>
      </div>
    );
  }
};