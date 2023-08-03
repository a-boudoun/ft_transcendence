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


const Page =  ({ params }: { params: number }) => {


  const dispatch = useDispatch<AppDispatch>();
  
console.log("page re")
  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
      const response = await axios.get(`http://localhost:8000/channels/${params.id}`); 
      const dt = response.data;
        console.log("dt",dt);
        dispatch(setcurrentChannel(dt as Channel));
  };
 
  return (
    <>
      <Mid />
      <Right />
      <Modal />
    </>
  );
}


export default Page;


