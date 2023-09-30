import React from 'react'
import Image from 'next/image';
import { config } from 'dotenv';

config();

export default function SingButton(){
    return (
        <a href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/42`} >
            <button className="flex text-black text-[0.75rem] leading-[14px] items-center justify-between bg-blue rounded-[1rem]  px-[1rem] py-[1.25rem] mt-[3.25rem]
            md:mt-[4rem] lg:py-[1.25rem] lg:px-[3.75rem] lg:text-[1.25rem] lg:rounded-[2rem] ">
                <Image className="mr-[1rem] lg:w-[4.5rem] lg:h-[3rem]" src="/icons/42.svg" width={44} height={32} alt="42"/>
                Sign in with intra
            </button>
        </a>
  )
}