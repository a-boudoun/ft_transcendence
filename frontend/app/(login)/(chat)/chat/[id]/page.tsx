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

const page = ({ params }: { params: number }) => {
    const [user, setUser] = useState<userDto>(null);
    const getUser = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:8000/users/find/${params.id}`, { withCredentials: true });
            setUser(data);
            return data;
        }
    });
   
    return (
        
        user && <div className={`justify-between text-white  rounded-xl  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 w-full sm:w-1/2 md:w-9/12 flex flex-col  `}>

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
                        className="h-10 w-10 rounded-full  "
                        src={user.image}
                        width={100}
                        height={100}
                        alt=""
                    />
                    <span className="text-center h-fit">{user.name}</span>
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
               messags
            </div>
            <div className="h-[56px] flex justify-between bg-dark-gray items-center px-3 py-2  rounded-lg">
                <form className="flex bg-inherit justify-between items-center w-full">
                    <input className="w-full bg-inherit h-10 rounded-md px-2 outline-none" type="text" placeholder="Type a message" />
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
   
    );
}
 
export default page;