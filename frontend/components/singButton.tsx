"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function SingButton(){
    const router = useRouter();

    return (
        <button className="flex text-black text-[0.75rem] leading-[14px] items-center justify-between bg-blue rounded-2xl  px-[1rem] py-[1.25rem] mt-[3.25rem]
        md:mt-[4rem] lg:py-[1.25rem] lg:px-[3.75rem] lg:text-[1.25rem] lg:rounded-[2rem] " onClick={ () => { router.push('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-7c14e29d1a92cc2775097600f5aadc92f42ee8aa7b5e8357b43841dc89773f84&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2F42%2Fredirect&response_type=code') }}> 
            <Image className="mr-[1rem] lg:w-[4.5rem] lg:h-[3rem]" src="/icons/42.svg" width={44} height={32} alt="42"/>
            Sign in with intra
       </button>
  )
}