"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function SingButton(){
    const router = useRouter();

    return (
        <button className="flex items-center justify-around bg-blue rounded-[34px] mt-20 py-[1vh] px-[3vw] 
        md:mt-[100px] sm:mt-[54px]"> 
            <Image className="mr-[40px]" src="/icons/42.svg" width={64} height={64} alt="42"/>
            Sign in with intra
       </button>
  )
}
