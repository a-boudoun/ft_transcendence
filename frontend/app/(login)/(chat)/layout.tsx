// "use client";
import Mid from "@/components/chat/Mid";
import Mininav from "@/components/chat/Mininav";
import Right from "@/components/chat/Right";
import Chat from "./chat/page";
import { use } from "react";
import Messeges from "@/components/chat/Messeges";
import ChNav from "@/components/chat/ChNav";
import Channel from "@/components/chat/Channel";
import Friend from "@/components/chat/Friend";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let res = true
  return (
    <main className={`h-full  pt-[56px] lg:p-[30px] lg:pt-[86px] flex   bg-dark-gray  justify-center `}>
      <div className=" w-full  flex gap-2 max-w-7xl overflow-hidden">
        <div className={`h-full w-full ${res === false ? 'hidden': ''} sm:block sm:w-1/2  lg:w-4/12    sm:rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4`}>
          <Mininav />
          
        </div>
        {children}
        {/* <div className={`hidden lg:${res === true ? 'hidden' : 'flex'}  lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl`}>

        </div> */}
      </div>
    </main>
  )
}