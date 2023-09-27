"use client";

import {userDto} from "@/dto/userDto";
import {  useQuery } from '@tanstack/react-query';
import axios from '@/apis/axios';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setChannels, setuser } from "@/redux/features/globalState";
import ChannelItems from "./ChannelItems";
import NewChannel from "./NewChannel";
import { usePathname} from "next/navigation";
import Friends from "./Friend";
import { User2 , Users2, UserPlus2 } from "lucide-react";

const Chat = () => {
   
    const dispatch = useDispatch<AppDispatch>();
    const [newchannel, setNewchannel] = useState(false);
    const [isChannel, setIsChannel] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [user, setUser] = useState<userDto>({} as userDto);
    const path = usePathname();

    const {isLoading} = useQuery(
        {
          queryKey: ['channels'],
          queryFn: async () => {
            const channelsResponse = await axios.get('/channels');
            const userDataResponse = await axios.get('/users/getUser/me');
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
        <div className={`h-full  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:rounded-[2rem] overflow-hidden`}>
          <div className={` w-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg h-fit flex justify-between mb-3   text-white gap-1`} >
              <button className={`w-1/3  flex items-center justify-center  py-3 text-sm font-semibold border-b-2   ${isFriend === true ? 'border-blue': 'border-transparent'}`} onClick={()=> handleclick(0)}>
                <User2 size={28} color="#7ac7c4" strokeWidth={2}  />
              </button>
              <button className={`w-1/3 flex items-center justify-center  py-3 text-sm  font-semibold border-b-2   ${isChannel === true ? 'border-blue': 'border-transparent'}`} onClick={()=> handleclick(1)}>
                <Users2 size={34} color="#7ac7c4" strokeWidth={1.5}  />
              </button>
              <button className={`w-1/3  flex items-center justify-center  py-3 text-sm font-semibold border-b-2   ${newchannel === true ? 'border-blue': 'border-transparent'}`} onClick={()=> handleclick(2)}>
                <UserPlus2 size={32} color="#7ac7c4" strokeWidth={1.5} />
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

export default Chat;