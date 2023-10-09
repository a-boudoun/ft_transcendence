"use client"

import React from 'react'
import SignInFrom from '@/components/signIn/SignInFrom';
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";

const singIn = () => {

  const User = useQuery({
    queryKey: ['signin'],
    queryFn: async ()=> {
      const {data} = await axios.get(`/users/signin`,)
      return data;
    },
  });

  if (User.isLoading)
    return <div>Loading...</div>
  return (
    <main className="grid place-content-center h-screen w-h-screen text-base">
        <section className="flex flex-col items-center rounded-[50px] py-[5.5rem] px-[2.25rem]
                    md:py-[5rem] md:px-[5.25rem] lg:px-[9rem] lg:py-[7.25rem] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg">
            <SignInFrom user={User.data}/>
        </section>
    </main>
  )
}

export default singIn;