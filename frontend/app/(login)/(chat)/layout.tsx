import Mid from "@/components/chat/Mid";
import Left from "@/components/chat/Left";
import Right from "@/components/chat/Right";
import Chat from "./chat/page";
import { use } from "react";
import Messeges from "@/components/chat/ChannelItems";
import ChNav from "@/components/chat/ChNav";
import Channel from "@/components/chat/Chat";
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
   
    <main className={`h-screen w-full pt-[56px]  sm:p-10 sm:pt-[96px] mx-auto flex  max-w-7xl `}>
     
        <Left />
        {children}
  
    </main>
  
  )
}
