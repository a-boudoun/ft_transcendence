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

const Page =  ({ params }: { params: number }) => {


  const dispatch = useDispatch<AppDispatch>();
 
  useEffect(() => {
      dispatch(setcurrentChannel(params));
  }, [params]);
  return (
    <>
      <Mid />
      <Right />
    </>
  );
}


export default Page;


