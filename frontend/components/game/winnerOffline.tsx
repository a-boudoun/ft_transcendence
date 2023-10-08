import React from "react";
import Image from "next/image";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Won(){

  const router = useRouter();

  setTimeout(() => {
    router.push("/game");
  }, 3000);
  
  const {data, isLoading} = useQuery({
		queryKey: ['user', 'me'],
		queryFn: async ()=> {
		  const {data} = await axios.get('http://localhost:8000/users/me', { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
    return (
      <div className='flex w-full h-full items-center justify-center '>
        <div className='flex flex-col gap-8 W-[600px] h-[600px] '>
          <h1 className='text-6xl font-bold text-[#4bff60f5] '>You Won</h1>
          <div className='flex W-[400px] h-[400px] border-black'>
            <Image width={100} height={100} alt="#" src={data.image} className="h-full w-full rounded-full"/>
          </div>
        </div>
      </div>
    );
  }
};