"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import ChannelItems from "./ChannelItems";
import userDto from "@/dto/userDto";
import NewChannel from "./NewChannel";
import channelDto from "@/dto/channelDto";
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setChannels } from "@/redux/features/currentChannel";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';

interface Message {
  content: string;
  from: string;
}
interface Data{
  id: number;
  name: string;
  image: string;
  type: string;
  password: string;
  messages: Message[];
  
}

const ChNav = ({data,  owner,  path}:{data:channelDto[], owner:userDto, path:string}) => {
   

  const dispatch = useDispatch<AppDispatch>();



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const response = await axios.get('http://localhost:8000/channels'); 
      const dt: Data[] = response.data;
      dispatch(setChannels(dt))
      return { dt };
    } catch (error) {
      console.error('Error fetching data:', error);
    
    }


  };
  
  // dispatch(setChannels(data));


    const [newchannel, setNewchannel] = useState(false);
    const activeStyle = "border-b-4 text-blue border-blue";

    

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
          <NewChannel owner={owner} />
        </div>
      </div>
    );
}

export default ChNav; 