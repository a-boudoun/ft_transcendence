"use client";

import Messeges from "./ChannelItems";
import Friends from "@/components/common/Friends";
import userDto from "@/dto/userDto";
import { hashQueryKey, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setChannels, setuser } from "@/redux/features/currentChannel";
import ChannelItems from "./ChannelItems";
import NewChannel from "./NewChannel";

const Channel = () => {
   
    const dispatch = useDispatch<AppDispatch>();
    const [newchannel, setNewchannel] = useState(false);
    const activeStyle = "bg-blue rounded-lg";

    const fetchData = useQuery(
        {
          queryKey: ['channels'],
          queryFn: async () => {
            const channelsResponse = await axios.get('http://localhost:8000/channels', { withCredentials: true });
            const userDataResponse = await axios.get('http://localhost:8000/users/me', { withCredentials: true });
            dispatch(setChannels(channelsResponse.data));
            dispatch(setuser(userDataResponse.data));

            return channelsResponse.data;
          }
        });

      const handleclick = (buttonNumber : number) => {
        buttonNumber === 1 ?  setNewchannel(false) : setNewchannel(true);
      }
    
      return (
        <div className={`h-full mt-2`}>
  
          <div className={` w-full bg-dark-gray+ h-fit flex justify-between mb-3   text-white gap-1`} >
              <button className={`w-1/2 flex items-center justify-center text-base py-1 font-semibold  ${newchannel === false ? activeStyle: 'text-blue'}`} onClick={()=> handleclick(1)}>
                Channel 
              </button>
              <button className={`w-1/2 flex items-center justify-center  text-base font-semibold   ${newchannel === true ? activeStyle: 'text-blue'}`} onClick={()=> handleclick(2)}>
                New Channel
              </button>
          </div>
          <div className={`${newchannel === true ? 'hidden': ''} h-full`}>
            <ChannelItems  path="/chat"/>
          </div>
          <div className={`${newchannel === false ? 'hidden': ''}  `}>
            <NewChannel />
          </div>
        </div>
      );
  }

export default Channel;