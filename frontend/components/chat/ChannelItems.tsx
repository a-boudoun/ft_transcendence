
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import userDto from "@/dto/userDto";
import channelDto from "@/dto/channelDto";

const ChannelItems = ({data, path}:{data:channelDto[], path:string}) => {
   
    
  

   
    path = path.slice(0, 5) === "/chat" ? "/chat" : "/channel";
    const hm  =(`h-[calc(100%-100px]`)
    console.log(data);
    return (
        <div className="h-full overflow-y-scroll py-2 ">
            {
            data.map((msg: channelDto) =>(
                <Link href={`/channel/${msg.name}`}>
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
 

