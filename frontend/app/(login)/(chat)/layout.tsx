import Mid from "@/components/chat/Mid";
import Left from "@/components/chat/Left";
import Right from "@/components/chat/Right";
import Chat from "./chat/page";
import { use } from "react";
import Messeges from "@/components/chat/ChannelItems";
import ChNav from "@/components/chat/ChNav";
import Channel from "@/components/chat/Channel";
import Friend from "@/components/chat/Friend";
import Modal from "@/components/chat/Modal";
import { useSelector } from 'react-redux';
import ReduxProvider from "@/redux/provider";

export default function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: string
}) {

  const ischild = true;
  

  return (
   
    <main className={`h-full  pt-[56px] lg:p-[30px] lg:pt-[86px] flex   justify-center `}>
      <div className=" w-full  flex gap-2 max-w-7xl overflow-hidden">
        <Left />
        {children}
      </div>
    </main>
  
  )
}
