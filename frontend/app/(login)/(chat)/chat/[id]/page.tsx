"use client";
import getData from "@/apis/getData";
import Mid from "@/components/chat/Mid";
import userDto from "@/dto/userDto";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useState , useEffect } from "react";
import axios from "axios";
import { set } from "zod";
import{ useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MessageDto from "@/dto/Message";
import { socket } from "@/components/chat/chatSocket";
import moment from "moment";
import { Message } from "@/components/chat/Mid";

const page = ({ params }: { params: any }) => {
    const router = useRouter();
    const user = useSelector((state: any) => state.globalState.user);
    const [otherUser, setOtherUser] = useState<userDto>();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [input, setInput] = useState('');
    

    const {data, isLoading} = useQuery({
        queryKey: ['direct', params.id],
        queryFn: async () => {
            const {data} = await axios.get(`http://localhost:8000/channels/${params.id}`, { withCredentials: true });
            setMessages(data.messages);
            socket.emit('join', { channel: data.id})
            return data;
        }
    });
   
    useEffect(() => {
        if(!data || !user || isLoading) return; 
        const otherUser = data.memberships.find((member: any) => member.member.username !== user.username);
        setOtherUser(otherUser.member);
    }, [data, user]);


    useEffect(() => {
        if (!socket.connected) 
            socket.connect();
    }, []);


    useEffect(() => {
        if (!data || !user || !socket|| !otherUser) return;
        const onMsg = (msg: any) => {
        
            const member = msg.from === user.username ? user : otherUser;
            const createdAt = moment().format('yyyy-MM-DDTHH:mm:ssZ');
            const newMessage = {content: msg.content, sender: member,  date: createdAt};
            setMessages((prev) => [...prev, {content: msg.content, sender: member,  date: createdAt}]);
    
        }
        socket.on('message', onMsg);
        return () => {
            socket.off('message', onMsg);
        }
    }, [data, socket, user, otherUser]);

    const handelSubmit = (event: any) => {
        event.preventDefault();
        if (!input.trim()) return;
        socket.emit('prevmessage', { channel: data.id, message: input, from: user.username });
        setInput('');
    }

    const handechange = (event: any) => {
        setInput(event.target.value);
        
    }



















    if (isLoading)
        return (
            <div className='w-full  md:w-1/2 lg:w-8/12 h-full bg-light-gray rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4'>
                <div className='w-full h-full bg-light-gray rounded-[2rem] flex justify-center items-center text-blue'>
                    Loading...
                </div>
            </div>);
    else if(!data)
            router.push('/chat');
    else
        return (
            
            <div className={`'w-full h-full  rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4 justify-between text-white   w-full md:w-1/2 lg:w-8/12 flex flex-col  `}>
                <div className={`flex flex-col justify-between bg-light-gray h-full rounded-[2rem] overflow-hidden`}>

                <div className="h-fit bg-dark-gray flex items-center py-3  rounded-xl  justify-between " >
                    <div className="flex items-center space-x-2 ">

                        <Link href={`/chat`}>
                            <Image
                                className="h-full  md:hidden"
                                src={"/img/back.svg"}
                                width={18}
                                height={18}
                                alt=""
                                />
                        </Link>
                        <Image
                            className="h-10 w-10 rounded-full  "
                            src={otherUser?.image}
                            width={100}
                            height={100}
                            alt=""
                            />
                        <span className="text-center h-fit">{otherUser?.name}</span>
                    </div>
                    <div className="text-3xl mr-5 flex items-center justify-center ">
                        <button  className="rounded-full hover:bg-light-gray p-1">
                            <Image
                                className="h-full rounded-full  "
                                src={"/img/more.svg"}
                                width={30}
                                height={30}
                                alt=""
                                />
                        </button>
                    </div>
                
                </div>
                <div className="overflow-y-auto flex-grow py-3 px-2" >
                {messages.map((message: MessageDto, id:number) => (
                 <Message key={id} msg={message.content} id={message.sender} user={user} date={message.date} />
                    ))}
                </div>
                <div className="h-[56px] flex justify-between bg-dark-gray items-center px-3 py-2  rounded-lg">
                    <form className="flex bg-inherit justify-between items-center w-full" onSubmit={handelSubmit}>
                        <input value={input} className="w-full bg-inherit h-10 rounded-md px-2 outline-none" type="text" placeholder="Type a message" onChange={(e:any)=> setInput(e.target.value)}/>
                        <button className="p-2 rounded-full hover:bg-light-gray">
                            <Image
                                src={"/img/send.svg"}
                                width={22}
                                height={22}
                                alt=""
                                />
                        </button>
                    </form>
                        
                    
                </div>    
                </div>
            </div>
    
        );
}
 
export default page;