"use client";

import Messeges from "./ChannelItems";
import userDto from "@/dto/userDto";
import { hashQueryKey, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setChannels, setuser } from "@/redux/features/globalState";
import ChannelItems from "./ChannelItems";
import NewChannel from "./NewChannel";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Friends from "./Friend";
import { set } from "zod";

const Channel = () => {
   
    const dispatch = useDispatch<AppDispatch>();
    const [newchannel, setNewchannel] = useState(false);
    const [isChannel, setIsChannel] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const activeStyle = " border-blue text-blue ";
    const [user, setUser] = useState<userDto>({} as userDto);
    const path = usePathname();
    const router = useRouter();
    const {data, isLoading} = useQuery(
        {
          queryKey: ['channels'],
          queryFn: async () => {
            console.log('fetching channels');
            const channelsResponse = await axios.get('http://localhost:8000/channels', { withCredentials: true });
            const userDataResponse = await axios.get('http://localhost:8000/users/me', { withCredentials: true });
            dispatch(setChannels(channelsResponse.data));
            dispatch(setuser(userDataResponse.data));
            setUser(userDataResponse.data);

            return channelsResponse.data;
          }
        });

      const handleclick = (buttonNumber : number) => {
       if(buttonNumber === 0){
        setIsFriend(true);
        setIsChannel(false);
        setNewchannel(false);
       }
        else if(buttonNumber === 1){
            setIsChannel(true);
            setIsFriend(false);
            setNewchannel(false);
        }
        else if(buttonNumber === 2){
            setIsChannel(false);
            setIsFriend(false);
            setNewchannel(true);

        }
      }

      useEffect(() => {
        if(path.slice(0, 5) === '/chat'){
            setIsFriend(true);
            setIsChannel(false);
            setNewchannel(false);
        }
        else if(path.slice(0, 8) === '/channel'){
            setIsChannel(true);
            setIsFriend(false);
            setNewchannel(false);
        }
      }, [path]);
      return (
        <div className={`h-full  bg-light-gray sm:rounded-[2rem] overflow-hidden`}>
          <div className={` w-full bg-dark-gray h-fit flex justify-between mb-3   text-white gap-1`} >
              <button className={`w-1/3  flex items-center justify-center border-b-2  py-3 text-sm font-semibold   ${isFriend === true ? activeStyle: 'border-dark-gray'}`} onClick={()=> handleclick(0)}>
              <Image className="w-7 h-7" src={'/img/msgb.svg'} width={100} height={100} alt={''} />
              </button>
              <button className={`w-1/3 flex items-center justify-center  border-b-2 py-3 text-sm  font-semibold  ${isChannel === true ? activeStyle: 'border-dark-gray'}`} onClick={()=> handleclick(1)}>
                <Image className="w-8 h-7" src={'/img/channelb.svg'} width={100} height={100} alt={''} />
              </button>
              <button className={`w-1/3  flex items-center justify-center  border-b-2 py-3 text-sm font-semibold   ${newchannel === true ? activeStyle: 'border-dark-gray'}`} onClick={()=> handleclick(2)}>
                <Image className="w-7 h-7" src={'/img/newchannel.svg'} width={100} height={100} alt={''} />
              </button>
          </div>
          <>
          {
          isLoading ? <div className="text-blue">Loading...</div> :
            <>
            <> {isFriend && <Friends user={user}/>}</>
            <> {isChannel && <ChannelItems  path="/chat"/>}</>
            <> {newchannel && <NewChannel />}</>
            </>
          }
          </>
        </div>
      );
  }

export default Channel;