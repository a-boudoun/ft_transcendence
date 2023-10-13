import React from "react";
import Image from 'next/image';
import { config } from 'dotenv';

config();


export default function Home() {
  return (
    <main className="grid place-content-center h-screen w-h-screen text-base">
      <section
        className="flex flex-col items-center rounded-[50px]  py-[5.5rem] px-[2.25rem]
                    md:py-[7.5rem] md:px-[5.25rem] lg:px-[9rem] lg:py-[7.25rem] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg "
      >
        <h1 className="text-red text-[6rem] leading-[120px] font-normal md:text-[8rem]">
          Ping
          <span className="block text-blue mt-[1rem] md:mt-[3rem] lg:inline">
            {" "}
            Pong
          </span>
        </h1>
        <a href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/42`}>
          <button
            className="flex text-black text-[0.75rem] leading-[14px] items-center justify-between bg-blue rounded-[1rem]  px-[1.4rem] py-[1.25rem] mt-[3.25rem]
            md:mt-[4rem] lg:py-[1.25rem] lg:px-[4.5rem] lg:text-[1.25rem] lg:rounded-[2rem] "
          >
            <Image
              className="mr-[1rem] w-[46px] h-[46px]"
              src="/icons/42.svg"
              width={28}
              height={0}
              alt="42"
            />
            Sign in with intra
          </button>
        </a>
        <a href={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/google`}>
          <button
            className="flex text-black text-[0.75rem] leading-[14px] items-center justify-between bg-white rounded-[1rem]  px-[1rem] py-[1.25rem] mt-[3.25rem]
            md:mt-[4rem] lg:py-[1.25rem] lg:px-[3.75rem] lg:text-[1.25rem] lg:rounded-[2rem] "
          >
            <Image
              className="mr-[1rem]"
              src="/icons/google.svg"
              width={46}
              height={46}
              alt="google"
            />
            Sign in with google
          </button>
        </a>
      </section>
    </main>
  );
}
