
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import userDto from "@/dto/userDto";
import channelDto from "@/dto/channelDto";
import { useSelector } from 'react-redux';

interface Data{
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    
}


const ChannelItems = ({path}:{path:string}) => {
    console.log("channel items re")

    const data: Data[] = useSelector((state: any) => state.currentChannel.channels);
    return (
        <div className="h-full overflow-y-scroll py-2 ">
            {
            data.map((msg: channelDto) =>(
                <Link href={`/channel/${msg.id}` }>
                    <ChannelItem key={msg.name} msg={msg} />
                </Link>
            ))}
        </div>
    );
}
 
export default ChannelItems;

export const ChannelItem = ({msg}:{msg:channelDto}) => { 
    const path = "/chat/" ;
    return (
        <div className={`bg-dark-gray h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white`}>
            <div className="flex items-center space-x-5">
                <Image
                className="rounded-full self-center"
                src={msg.image}
                width={42}
                height={42}
                alt=""
                />
                <h3>{msg.name}</h3>
            </div>
        </div>
    );
}
 

