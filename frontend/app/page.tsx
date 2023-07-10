import React from 'react'
import Link from 'next/link'
import SingButton from '@/components/singButton'


export default function Home() {
  return (
    <main className="grid place-content-center h-screen w-h-screen bg-ping-pong bg-cover text-base">
        <section className="flex flex-col items-center bg-dark-gray/60 rounded-[50px] py-[5.5rem] px-[2.25rem]
                    md:py-[7.5rem] md:px-[5.25rem] lg:px-[9rem] lg:py-[7.25rem] ">
            <h1 className="text-red text-[6rem] leading-[120px] font-normal md:text-[8rem]">
                Ping
              <span className="block text-blue mt-[1rem] md:mt-[3rem] lg:inline"> Pong</span>
            </h1>
            <SingButton />
        </section>
    </main>
  )
}