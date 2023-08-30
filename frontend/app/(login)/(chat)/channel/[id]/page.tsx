"use client";
import React, { useEffect } from 'react'
import Mid from '@/components/chat/Mid';
import Right from '@/components/chat/Right';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { setcurrentChannel, resetcurrent } from "@/redux/features/currentChannel";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useParams, usePathname } from 'next/navigation';
import Channel from '@/dto/Channel';
import Modal from '@/components/chat/Modal';
import { socket } from '@/components/chat/chatSocket';
import { useRouter } from 'next/navigation';


const Page =  ({ params }: { params: number }) => {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = useQuery(
  {
      queryKey: ['channel'],
      queryFn: async () => {
        const channel = await axios.get(`http://localhost:8000/channels/${params.id}`, { withCredentials: true });
        if(!channel.data)
        {
          // alert('Channel not found');
          router.push('/channel');
          return;
        }
        dispatch(setcurrentChannel(channel.data));
        socket.emit('join', { channel: channel.data.id })
        return channel.data;
      }
  });

  return (
    <>
      <Mid />
      <Right />
      <Modal />
    </>
  );
}


export default Page;


