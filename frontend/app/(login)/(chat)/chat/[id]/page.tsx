"use client";
import {userDto} from "@/dto/userDto";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState , useEffect, use } from "react";
import axios from "axios";
import{ useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MessageDto from "@/dto/Message";
import { socket } from "@/components/chat/chatSocket";
import moment from "moment";
import { Message } from "@/components/chat/Mid";
import { Client } from "@/providers/QueryProvider";
import { setuser } from "@/redux/features/globalState";
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/redux/store';



const  More = ({user}:{user: userDto}) => {
  
    const router = useRouter();
      return (
        <div className="absolute w-56  h-fit rounded-[1.4rem]   top-4 right-3  bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg p-3 ">
              <div className="bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-[1.2rem] overflow-hidden">
  
              <button className="flex items-center justify-start px-4 py-2 w-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg rounded-t-lg" onClick={()=> router.push(`/profile/${user.username}`)}>
                  <Image
                      className="h-8 w-8 rounded-full  "
                      src={user.image}
                      width={100}
                      height={100}
                      alt=""
                      />
                  <span className="pl-6 text-base font-semibold text-blue" >view Profile</span>
              </button>
              <button className="flex items-center justify-start px-4 py-2 w-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg rounded-b-lg" onClick={()=> socket.emit('invite-freind', user.username)}>
                  <Image
                      className="h-6 w-6   "
                      src={"/icons/profile/matches.svg"}
                      width={100}
                      height={100}
                      alt=""
                      />
                      <span className="px-6 text-base font-semibold text-blue" >Play</span>
              </button>
          </div>
        </div>
      )
    }

const page = ({ params }: { params: {id: number} }) => {


    const dispatsh = useDispatch<AppDispatch>();

    const router = useRouter();
    const user = useSelector((state: any) => state.globalState.user);
    const [otherUser, setOtherUser] = useState<userDto>();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isblocked, setIsblocked] = useState(false);
    
    const {data, isLoading} = useQuery({
        queryKey: ['direct', params.id],
        queryFn: async () => {
            const {data} = await axios.get(`http://localhost:8000/channels/directchannel/${params.id}`, { withCredentials: true });
            
            setMessages(data.messages);
            socket.emit('join', { channel: data.id})
            if(!data || data.type !== 'Direct')
            {
                router.push('/chat');
                return data;
            }
            return data;
        }
    });
    const Blocked = useMutation({
        mutationKey: ['block', otherUser?.id],
        mutationFn: async () => {
            if(!otherUser ) return;
            const {data} = await axios.get(`http://localhost:8000/users/isBlocked/${otherUser.id}`, { withCredentials: true });
            return data;
        }
    });
    useEffect(() => {
        if(!data || !user || isLoading) return; 
        const otherUser = data.memberships.find((member: any) => member.member.username !== user.username);
        if(!otherUser) return;
        setOtherUser(otherUser.member);
        Blocked.mutate();
        setIsblocked(Blocked.data?.isBlock);
    }, [data, user]);
    

    // const blocked = useQuery({
    //     queryKey: ['blocked', otherUser?.id],
    //     queryFn: async () => {
    //         if(!otherUser ) return;
    //         const {data} = await axios.get(`http://localhost:8000/users/isBlocked/${otherUser.id}`, { withCredentials: true });
    //         console.log("data", user.id, data);
    //         return data;
    //     }
    // });
    
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

   

    if (isLoading || !data || !user.id || !otherUser )
        return (
            <div className='w-full  md:w-1/2 lg:w-8/12 h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4'>
                <div className='w-full h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:rounded-[2rem] flex justify-center items-center text-blue'>
                    Loading...
                </div>
            </div>);
    else if(!data || data.type !== 'Direct')
            router.push('/chat');
    else
        return (
            
            <div className={`'w-full h-full  sm:rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4 justify-between text-white   w-full md:w-1/2 lg:w-8/12 flex flex-col  `}>
                <div className={`flex flex-col justify-between bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg h-full sm:rounded-[2rem] overflow-hidden`}>

                <div className="h-fit bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg flex items-center py-3  rounded-xl  justify-between " >
                    <div className="flex items-center space-x-2 ">

                        <Link href={`/chat`}>
                            <Image
                                className="h-full  md:hidden mx-2"
                                src={"/img/back.svg"}
                                width={18}
                                height={18}
                                alt=""
                                />
                        </Link>
                       { otherUser?.image && <Image
                            className="h-10 w-10 rounded-full  "
                            src={otherUser?.image}
                            width={100} 
                            height={100}
                            alt=""
                            />}
                        <span className="text-center h-fit">{otherUser?.username}</span>
                    </div>
                    <div className="text-3xl mr-5 flex items-center justify-center relative">
                        <button  className="rounded-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg  p-1" onClick={()=> setIsOpen(!isOpen)}>
                            <Image
                                className="h-full rounded-full  "
                                src={"/img/more.svg"}
                                width={30}
                                height={30}
                                alt=""
                                />
                        </button>
                        <div className="relative">

                        {isOpen && <More user={otherUser} /> }
                        </div>
        
                    </div>
                
                </div>
                <div className="overflow-y-auto flex-grow py-3 px-2" >
                {messages.map((message: MessageDto, id:number) => (
                 <Message key={id} msg={message.content} id={message.sender} user={user} date={message.date} />
                    ))}
                </div>
                <div className="h-[56px] flex justify-between bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg items-center px-3 py-2  rounded-lg">
               { !( isblocked) &&   <form className="flex  justify-between items-center w-full" onSubmit={handelSubmit}>
                        <input value={input} className="bg-transparent w-full  h-10 rounded-md px-2 outline-none" type="text" placeholder="Type a message" onChange={(e:any)=> setInput(e.target.value)}/>
                        <button className="p-2 rounded-full hover:bg-light-gray">
                            <Image
                                src={"/img/send.svg"}
                                width={22}
                                height={22}
                                alt=""
                                />
                        </button>
                    </form>}
                        
                    
                </div>    
                </div>
            </div>
    
        );
}
 
export default page;

