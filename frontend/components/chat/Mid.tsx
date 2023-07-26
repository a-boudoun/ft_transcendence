"use client";
import { useParams } from 'next/navigation'
import { useState } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import io from 'socket.io-client';
import userDto from "@/dto/userDto";
import channelDto from '@/dto/channelDto';
import { useSelector } from 'react-redux';
import { set } from 'zod';
import { setMessage } from '@/redux/features/currentChannel';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';

const socket = io('http://localhost:8000', {
    autoConnect: false,
    transports: ['websocket'],
});


interface User {
    userID: string;
    username: string;
}

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
    
}


const Mid = () => {

    const receiver = useParams();
    const data: Data = useSelector((state: any) => state.currentChannel.channel);
    const messages: Message[] = useSelector((state: any) => state.currentChannel.channel.messages);
    const [input, setInput] = useState('');
   
    const dispatch = useDispatch<AppDispatch>();
    const messageContainerRef = useRef(null);

    const handelchange = (event: any) => {
        const msg = event.target.value;
        setInput(msg);
    }


    const handelSubmit = (event: any) => {
        event.preventDefault();
        if(!input.trim()) return;
        dispatch(setMessage({content: input, from: "me"}));
        setInput('');
    }


    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);



    return (
        <div className={` h-full w-full flex sm:w-1/2 lg:w-5/12 flex-col text-white  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4`}>
            <div className="h-fit bg-dark-gray flex items-center py-3  rounded-xl" >
                <div className="flex items-center space-x-2 ">

                    <Link href={`/chat`}>
                        <Image
                            className="h-full  sm:hidden"
                            src={"/img/back.svg"}
                            width={18}
                            height={18}
                            alt=""
                        />
                    </Link>
                    <Image
                        className="h-full rounded-full  "
                        src={data.image}
                        width={30}
                        height={30}
                        alt=""
                    />
                    <span className="text-center h-fit">{data.name}</span>
                </div>
            </div>
            <div className="overflow-y-auto flex-grow " ref={messageContainerRef}>
                {
                    messages.map((msg: Message) => (
                        <Message msg={msg.content} id={msg.from} />
                    ))
                }
            </div>
            <div className="h-[56px] flex justify-between bg-dark-gray items-center px-3 py-2  rounded-lg">
                <form onSubmit={handelSubmit} className="flex bg-inherit justify-between items-center w-full">
                    <input type="text" value={input} onChange={handelchange} className="w-full bg-inherit h-10 rounded-md px-2 outline-none" placeholder="Send Message.." />
                    <button type="submit" className="  px-3 rounded-md">
                        <Image src="/img/send.svg" width={20} height={20} alt="" />
                    </button>
                </form>
            </div>
        </div>


    );
}

export default Mid;


export const Message = (msg: any) => {
    return (

        <div className="flex  flex-col bg-dark-gray w-fit  max-w-[250px] rounded-md  py-2 m-2">
            <div className="flex justify-between text-blue">
                <div className="text-left px-2 text-xs">
                    {msg.id}
                </div>
                <div className="px-2 text-xs">
                    20:20
                </div>
            </div>
            <div key={msg.id} className="px-3 break-words text-left">
                {msg.msg}
            </div>
        </div>
    );
}





