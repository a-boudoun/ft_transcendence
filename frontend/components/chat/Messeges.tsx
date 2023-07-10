"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface messageProps
{
    
    id: number;
    name: string;
    image: string;
}

const Messages = () => {
    const [data, setData] = useState<messageProps[]>([]);

    useEffect(()=>{
        const getData = async () =>
        {
            const res = await fetch(`http://localhost:3001/users`);
            const json = await res.json();
            setData(json);
        };
        getData();
    }, [])
    
  

    let path : string = usePathname();
    path = path.slice(0, 5) === "/chat" ? "/chat" : "/channel";
    const hm  =(`h-[calc(100%-100px]`)
    return (
        <div className={`h-full overflow-y-scroll py-2 `}>
            {
            data.map((msg: messageProps) =>(
                <Link href={`${path}/${msg.name}`}>
                    <Message key={msg.id} msg={msg} />
                </Link>
            ))}
        </div>
    );
}
 
export default Messages;


export const Message = ({msg}:{msg:messageProps}) => { 
    const path = usePathname();
    console.log(path);
    const style = path === "/chat/" + msg.id.toString() ? "bg-dark-gray" : "bg-dark-gray";
    return (
        <div className={`${style} flex justify-between h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white`}>
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
 

