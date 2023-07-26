"use client";
import React, { useEffect } from 'react'
import Mid from '@/components/chat/Mid';
import Right from '@/components/chat/Right';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import {setcurrentChannel, resetcurrent} from "@/redux/features/currentChannel";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

const Page = async({params}:{params: string}) => {
  
    // const user : userDto = await getData('/users/getUser');
    const dispatch = useDispatch<AppDispatch>();
    const { data, isLoading } = useQuery({
        queryKey: ['channel'],
        queryFn: async () =>  {
         const {data} = await axios.get(`http://localhost:8000/channels/${params.id}`, {withCredentials: true});
          return data;
        }
      })
      useEffect(() => {
        if (!data) return;
        dispatch(setcurrentChannel(data));
      }, [data]);
        return (
            <>
            <Mid  />
            <Right/>
        </>
    );
}


export default Page;


