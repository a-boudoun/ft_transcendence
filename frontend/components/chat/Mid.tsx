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
import { setMembership, setMessage, setisMid, setisChild } from '@/redux/features/currentChannel';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import Channel from '@/dto/Channel';
import Message from '@/dto/Message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { socket } from './chatSocket';
import moment from 'moment';



function Mid() {
    const dispatch = useDispatch<AppDispatch>();

    const channel = useSelector((state: any) => state.currentChannel.channel);
    const user = useSelector((state: any) => state.currentChannel.user);
    const isMid = useSelector((state: any) => state.currentChannel.isMid);
    const messages = useSelector((state: any) => state.currentChannel.channel.messages);
    const [input, setInput] = useState('');
    

    useEffect(() => {
        if (!socket.connected) 
            socket.connect();
        dispatch(setisChild(true));
    }, []); 
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
        socket.emit('prevmessage', { channel: channel.id, message: input, from: user.name });
        setInput('');
    }
    
    useEffect(() => {
        const onMsg = (msg: any) => {
           function ss(member: any) {
            return (member.member.username === msg.from);
           }
            const member = channel.memberships?.find(ss).member;
            const createdAt = moment().format('yyyy-MM-DDTHH:mm:ssZ');
            dispatch(setMessage({ content: msg.content, from: member, createdAt: createdAt }));
        }
        socket.on('message', onMsg);
        return () => {
            socket.off('message', onMsg);
        }
    }, [channel]);


    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleJoinChannel = () => {
        joinChannel.mutate(user);
    }
    const isMember = channel.memberships?.some((membership :any) => membership.member.id === user.id)
    { if (channel.memberships) 
    return (
        <div className={`justify-between text-white  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 ${isMid === true ? 'w-full sm:w-1/2 md:w-7/12 flex flex-col lg:w-5/12' : 'hidden lg:flex lg:flex-col  lg:w-5/12'} `}>
            <div className="h-fit bg-dark-gray flex items-center py-3  rounded-xl  justify-between " >
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
                    <button onClick={() => dispatch(setisMid(false))}>
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
                        <Message key={id} msg={msg.content} id={msg.from} user={user} date={msg.createdAt} />
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
}

export default Mid;


export const Message = (msg: any) => {
   
    const [style, setStyle] = useState('');
    const [date, setDate] = useState('');
    useEffect(() => {
        setStyle(`${msg.id.username === msg.user?.username ? 'justify-end' : 'justify-start'}`);
    }, [msg.id]);
    useEffect(() => {
    setDate(moment.duration(moment().diff(msg.date)).humanize());
    }, [moment().diff(msg.date)]);
    return (
        <div className={`w-full flex flex-col `}>

        <div className={`w-full flex ${style} text-xs`}>{date}</div>
        <div className={`w-full flex ${style} items-center m-0 p-0`}>
            <div className="flex  flex-col bg-dark-gray w-fit  max-w-[250px] rounded-md  py-2 m-2 ">
                <div className="flex justify-between text-blue">
                  
                </div>
                <div key={msg.id} className="px-3 break-words text-left">
                    {msg.msg}
                </div>
            </div>
            <div className={`${msg.id.username === msg.user.username ? '' : 'order-first'}`}>
                <Image
                    className="h-[30px] w-[30px]  rounded-full"
                    src={msg.id.image}
                    width={1000}
                    height={1000}
                    alt="" />
            </div>
        </div>
        </div>
    );
}





