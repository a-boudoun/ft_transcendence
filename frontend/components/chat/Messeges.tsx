
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import userDto from "@/dto/userDto";

const Messages = ({data, path}:{data:userDto[], path:string}) => {
   
    
  

   
    path = path.slice(0, 5) === "/chat" ? "/chat" : "/channel";
    const hm  =(`h-[calc(100%-100px]`)
    return (
        <div className="h-full overflow-y-scroll py-2 ">
            {
            data.map((msg: userDto) =>(
                <Link href={`${path}/${msg.name}`}>
                    <Message key={msg.username} msg={msg} />
                </Link>
            ))}
        </div>
    );
}
 
export default Messages;


export const Message = ({msg}:{msg:userDto}) => { 
    const path = "/chat/" ;
    return (
        <div className={`bg-dark-gray flex justify-between h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white`}>
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
            <div className="flex items-center space-x-2  justify-between">
                <Image
                className="rounded-full"
                src="/img/block.svg"
                width={26}
                height={26}
                alt=""
                />
                <Image
                className="rounded-full"
                src="/img/play.svg"
                width={26}
                height={26}
                alt=""
                />
            </div>
        </div>
    );
}
 

