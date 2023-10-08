import React from "react";
import Image from "next/image";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Won(){

  const router = useRouter();

  setTimeout(() => {
    router.push("/game");
  }, 2000);
  
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
      <main className="h-full w-full grid place-content-center pt-14">
        <div className='flex flex-col items-center gap-8'>
          <h1 className='text-6xl font-bold text-[#4bff60f5] '>You Won</h1>
          <div className='w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border-black rounded-full overflow-hidden '>
            <Image width={400} height={0} alt="#" src={data.image} className="h-full w-full l"/>
          </div>
        </div>
      </main>
    );
  }
};