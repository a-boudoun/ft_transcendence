import React from 'react'
import Link from 'next/link'
import Button from './conponents/singButton'

export default function Home() {
  return (
    <main className="grid place-content-center h-full w-full bg-ping-pong bg-cover text-base">
        <div className="flex flex-col items-center bg-light-gray/60 rounded-[50px] py-[8rem] px-[9rem]
                        md:py-[6rem] md:px-[6rem] sm:py-[5rem] sm:px-[3rem]">
            <h1 className="text-red text-[7rem] leading-[121px] font-normal tracking-wides">
                Ping
              <span className="text-blue md:block md:mt-[40px] sm:block sm:mt-[20px]"> Pong</span>
            </h1>
            <Button />
        </div>
    </main>
  )
}