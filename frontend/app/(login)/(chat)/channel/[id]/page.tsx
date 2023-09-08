"use client";
import React, { useEffect } from 'react'
import Mid from '@/components/chat/Mid';
import Right from '@/components/chat/Right';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { setcurrentchannel, setMemberships, setuser } from "@/redux/features/globalState";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useParams, usePathname } from 'next/navigation';
import Channel from '@/dto/Channel';
import Modal from '@/components/chat/Modal';
import { socket } from '@/components/chat/chatSocket';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Client } from '@/providers/QueryProvider';
import { channel } from 'diagnostics_channel';



const Page =  ({ params }: { params: number }) => {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // const user = useSelector((state: any) => state.globalState.user);
 
  const {data, isLoading} = useQuery(
  {
      queryKey: ['channel'],
      queryFn: async () => {
        const channel = await axios.get(`http://localhost:8000/channels/${params.id}`, { withCredentials: true });
        const user = await axios.get(`http://localhost:8000/users/me`, { withCredentials: true });
        
        if(!channel.data )
        {
          router.push('/channel');
          return channel.data;
        }
        if(channel.data.type === 'Direct')
           router.push(`/chat/${channel.data.id}`);
        dispatch(setcurrentchannel(channel.data));
        dispatch(setuser(user.data));
        socket.emit('join', { channel: channel.data.id })
        return channel.data;
      }
  });
  if (isLoading)
    return( 
    <div className='w-full  md:w-1/2 lg:w-8/12 h-full bg-light-gray rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4'>
      <div className='w-full h-full bg-light-gray rounded-[2rem] flex justify-center items-center text-blue'>
            Loading...
      </div>
    </div>);
  else if(data.type !== 'Direct')
  return (
    <>
      <Mid />
      <Right />
      <Modal />
    </>
  );
}


export default Page;


