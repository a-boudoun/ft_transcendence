"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface messageProps
{
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

const Messages = () => {
    const [data, setData] = useState<messageProps[]>([]);

    useEffect(()=>{
        const getData = async () =>
        {
            const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=30`);
            const json = await res.json();
            setData(json);
        };
        getData();
    }, [])
    
  
    
    return (
        <div className={`h-full mt-2 flex  flex-col overflow-y-scroll`}>
            {
            data.map((msg: messageProps) =>(
                <Link href={`chat/${msg.id}`}>
                    <Message key={msg.id} msg={msg} />
                </Link>
            ))}
        </div>
    );
}
 
export default Messages;


export const Message = ({msg}:{msg:messageProps}) => { 
    const path = usePathname();
    console.log(path.at(-1));
    const style = path.at(-1) === msg.id.toString() ? "bg-light-gray" : "bg-dark-gray";
    return (
        <div className={`${style} flex justify-between h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white`}>
            <div className="flex items-center space-x-5">
                <Image
                className="rounded-full self-center"
                src={msg.url}
                width={42}
                height={42}
                alt=""
                />
                <h3>{msg.id}</h3>
                
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
 