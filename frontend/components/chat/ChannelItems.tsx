
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import userDto from "@/dto/userDto";
import channelDto from "@/dto/channelDto";
import axios from "axios";
import { useSelector } from "react-redux";
import Channel from "@/dto/Channel";

interface Data{
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;

}


const ChannelItems = ({path}:{path:string}) => {

    const data :Channel[] = useSelector((state: any) => state.currentChannel.channels);
    return (
        
        <div className="h-[90%] overflow-y-scroll py-2 ">
            {
            data?.map((data: Channel) =>(
                <Link href={`/channel/${data.id}` }>
                    <ChannelItem key={data.id} channel={data}  />
                </Link>
            ))
        
            }
        </div>
    );
}
 
export default ChannelItems;

export const ChannelItem = ({channel}:{channel:Channel}) => { 
   
    return (
        <div className={`bg-dark-gray h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white flex justify-between`}>
            <div className="flex items-center space-x-5">
                <Image
                className="rounded-full self-center"
                src={channel.image}
                width={42}
                height={42}
                alt=""
                />
                <h3>{channel.name}</h3>
            </div>
            <div>
               <h2>{channel.type}</h2> 
            </div>
        </div>
    );
}
 

