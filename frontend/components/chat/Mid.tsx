"use client";
import { useParams } from 'next/navigation'
import { use, useState } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import io from 'socket.io-client';
import userDto from "@/dto/userDto";
import channelDto from '@/dto/channelDto';
import { useSelector } from 'react-redux';
import { set } from 'zod';
import { setMembership, setMessage } from '@/redux/features/currentChannel';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import Channel from '@/dto/Channel';
import Message from '@/dto/Message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { socket } from './chatSocket';


function Mid() {
    const channel = useSelector((state: any) => state.currentChannel.channel);
    const user = useSelector((state: any) => state.currentChannel.user);
    const isMid = useSelector((state: any) => state.currentChannel.isMid);
    const [input, setInput] = useState('');


    if (!socket.connected) {
        socket.connect();
    }
   

    const messages: Message[] = channel.messages;
    const dispatch = useDispatch<AppDispatch>();
    const messageContainerRef = useRef(null);

    const joinChannel = useMutation({
        mutationFn: async (user: userDto) => {
            const { data } = await axios.patch(`http://localhost:8000/channels/${channel.id}/joinChannel`, user, { withCredentials: true });
            dispatch(setMembership(data));
            return data;
        },
        onSuccess: () => {
            console.log("joined")
        }
    });

    const handelchange = (event: any) => {
        const msg = event.target.value;
        setInput(msg);
    }


    const handelSubmit = (event: any) => {
        event.preventDefault();
        if (!input.trim()) return;
        // dispatch(setMessage({ content: input, from: user.name }));
        socket.emit('prevmessage', { channel: channel.id, message: input, from: user.name });
        setInput('');
    }
       useEffect(() => {
        const onMsg = (msg: any)=>{
            dispatch(setMessage({ content: msg.content, from: msg.from }));
        }
        socket.on('message', onMsg);
        return()=>{
            socket.off('message', onMsg);
        }
    }, []);
  

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, []);

    const handleJoinChannel = () => {
        joinChannel.mutate(user);
    }


    const isMember = channel.memberships?.some((membership) => membership.member.id === user.id)
    { if (!channel.image) return <div></div> }
    return (
        <div className={` h-full w-full flex sm:w-1/2 lg:w-5/12 flex-col justify-between text-white  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4`}>
            <div className="h-fit bg-dark-gray flex items-center py-3  rounded-xl flex justify-between " >
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
                        src={channel.image}
                        width={30}
                        height={30}
                        alt=""
                    />
                    <span className="text-center h-fit">{channel.name}</span>
                </div>
                <div className="text-3xl mr-5 flex items-center justify-center lg:hidden ">
                    <button >
                    <Image
                        className="h-full rounded-full  "
                        src={"/img/info.svg"}
                        width={24}
                        height={24}
                        alt=""
                    />
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto flex-grow " ref={messageContainerRef}>
                {
                    messages?.map((msg: Message, id: number) =>


                        <Message key={id} msg={msg.content} id={msg.from}  user={user.username}/>

                    )
                }
            </div>
            <div className="h-[56px] flex justify-between bg-dark-gray items-center px-3 py-2  rounded-lg">
                <form onSubmit={handelSubmit} className={` ${isMember === true ? '' : 'hidden'} flex bg-inherit justify-between items-center w-full`}>
                    <input type="text" value={input} onChange={handelchange} className="w-full bg-inherit h-10 rounded-md px-2 outline-none" placeholder="Send Message.." />
                    <button type="submit" className="  px-3 rounded-md">
                        <Image src="/img/send.svg" width={20} height={20} alt="" />
                    </button>
                </form>
                <button className={` ${isMember === false ? '' : 'hidden'} flex  justify-center items-center  w-full h-full text-blue`} onClick={handleJoinChannel} >
                    Join
                </button>
            </div>
        </div>


    );
}

export default Mid;


export const Message = (msg: any) => {
    const style = msg.id === msg.user ? "justify-end" : "justify-start";
    return (
        <div className={`w-full flex ${style}`}>
            <div className="flex  flex-col bg-dark-gray w-fit  max-w-[250px] rounded-md  py-2 m-2 ">
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
        </div>

    );
}





