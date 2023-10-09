"use client";
import React, { useEffect } from 'react'
import Mid from '@/components/chat/Mid';
import Right from '@/components/chat/Right';
import { useQuery } from '@tanstack/react-query'
import axios from '@/apis/axios';
import { setcurrentchannel, setMemberships, setuser } from "@/redux/features/globalState";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useParams, usePathname } from 'next/navigation';
import Channel from '@/dto/Channel';
import Modal from '@/components/chat/Modal';
import { socket } from '@/components/chat/chatSocket';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { channel } from 'diagnostics_channel';



const Page =  ({ params }: { params: {id:any} }) => {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
 
  
  const {data, isLoading} = useQuery(
  {
      queryKey: ['channel'],
      queryFn: async () => {

        if(!parseInt(params.id) || params.id.length > 8)
        {
          router.push('/channel');
          return null;
        }
        const channel = await axios.get(`/channels/${params.id}`);
        const user = await axios.get(`/users/getUser/me`);
        
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
  if (isLoading || !data)
    return( 
    <div className='w-full  md:w-1/2 lg:w-8/12 h-full rounded-[2.5rem] bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg p-4'>
      <div className='w-full h-full bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg rounded-[2rem] flex justify-center items-center text-blue'>
            Loading...
      </div>
    </div>);
  else if(data && data.type !== 'Direct')
  return (
    <>
      <Mid />
      <Right />
      <Modal />
    </>
  );
}


export default Page;


