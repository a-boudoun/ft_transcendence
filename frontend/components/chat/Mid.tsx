"use client";
import { useParams } from 'next/navigation'
import { useState } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import io from 'socket.io-client';
import userDto from "@/dto/userDto";

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



const Mid = ({ user }: { user: userDto }) => {

    const receiver = useParams();
    const username: string = user.username;
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [myusers, setMyusers] = useState<User[]>([]);

    socket.auth = { username };
    socket.connect();
    const messageContainerRef = useRef(null);
   
    // fetch all messages



    const handelchange = (event: any) => {
        const msg = event.target.value;
        setMessage(msg);
    }


    const handelSubmit = (event: any) => {
        event.preventDefault();

        const receiverIds = myusers
            .filter((tuser: User) => (tuser.username === receiver.id || (tuser.username === username)))
            .map((tuser: User) => tuser.userID);


            if (receiverIds.length > 0) { receiverIds.forEach((receiverId: string) => {

                    socket.emit("private message", {
                        content: message,
                        to: receiverId,
                        from: username,
                    });

                });

            setMessages((messages: Message[]) => [...messages, { content: message, from: "me" }]);
            setMessage('')
        }
    }

    useEffect(() => {
        socket.on("users", (users: User[]) => {
            setMyusers(users);
        });

        socket.on("user connected", (users: User[]) => {
            setMyusers(users)
        });


        socket.on("private message", ({ content, from }: { content: string, from: string }) => {
            setMessages((messages: Message[]) => [...messages, { content, from }]);
        });

    }, []);











    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, []);
    useEffect(() => {
       console.log(myusers)
    }, []);



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
                        className="h-full  "
                        src={"/img/profile.svg"}
                        width={30}
                        height={30}
                        alt=""
                    />
                    <span className="text-center h-fit">{receiver.id}</span>
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
                    <input type="text" value={message} onChange={handelchange} className="w-full bg-inherit h-10 rounded-md px-2 outline-none" placeholder="Send Message.." />
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



