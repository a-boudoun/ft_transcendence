import React from 'react';
import Image from "next/image";
import axios from '@/apis/axios';
import { useQuery } from "@tanstack/react-query";

export default function Lost(){
  const {data, isLoading} = useQuery({
		queryKey: ['user', 'me'],
		queryFn: async ()=> {
		  const {data} = await axios.get('/users/getUser/me')
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
    return (
      <div className='flex flex-col gap-8 w-full h-full items-center justify-center '>
        <div className='flex flex-col gap-8 W-[600px] h-[600px] '>
          <h1 className='text-6xl font-bold text-[#fc4f4f]'>You Lost</h1>
          <div className='flex W-[400px] h-[400px] border-black'>
            <Image width={100} height={100} alt="#" src={data.image} className="h-full w-full rounded-full"/>
          </div>
        </div>
      </div>
    );
  }
};