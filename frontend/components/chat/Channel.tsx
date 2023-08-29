"use client";
import getData from "@/apis/getData";
import ChNav from "./ChNav";
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
    const activeStyle = "border-b-4 text-blue border-blue";

    const fetchData = useQuery(
        {
          queryKey: ['channels'],
          queryFn: async () => {
            const channelsResponse = await axios.get('http://localhost:8000/channels', { withCredentials: true });
            const userDataResponse = await axios.get('http://localhost:8000/users/me', { withCredentials: true });
            dispatch(setChannels(channelsResponse.data));
            dispatch(setuser(userDataResponse.data));
          }
        });

      const handleclick = (buttonNumber : number) => {
        buttonNumber === 1 ?  setNewchannel(false) : setNewchannel(true);
      }
    
      return (
        <div className={`h-full`}>
  
          <div className={` w-full bg-dark-gray+ h-10 flex justify-between  py-2 text-white gap-1`} >
              <button className={`w-1/2 flex items-center justify-center text-lg  ${newchannel === false ? activeStyle: ''}`} onClick={()=> handleclick(1)}>
                Channel 
              </button>
              <button className={`w-1/2 flex items-center justify-center  text-lg  ${newchannel === true ? activeStyle: ''}`} onClick={()=> handleclick(2)}>
                New Channel
              </button>
          </div>
          <div className={`${newchannel === true ? 'hidden': ''} h-full`}>
            <ChannelItems  path="/chat"/>
          </div>
          <div className={`${newchannel === false ? 'hidden': ''}  `}>
            <NewChannel  />
          </div>
        </div>
      );
  }

export default Channel;