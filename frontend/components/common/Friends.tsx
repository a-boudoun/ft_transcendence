'use client'

import Image from 'next/image';
import Link from "next/link";
import getData from "@/apis/server/get";
import userDto from "@/dto/userDto";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { use } from 'react';


const Friends = () => {

    const {data, isLoading} = useQuery({
        queryKey: ['users'],
        queryFn: async ()=> {
            const { data } = await axios.get('http://localhost:8000/users', { withCredentials: true });
            return data;
        }
      });
   
      if (isLoading) 
      return <div className="">loading... </div>
      else {
        return (
        <div className={'h-full flex flex-col gap-1 overflow-y-scroll rounded-2xl'}>
                {
                    data.users?.map((friend: userDto) => {
                        return (
                            <Link href={`/profile/${friend.name}`} >
                                <Friend user={friend} /> 
                            </Link>
                        );
                    })
                }   
            </div>
        );
    }
}

export default Friends;

export const Friend = ({user}: {user: userDto}) => {

    return (
        <div className={`flex justify-between px-4 py-2 mx-2 rounded-xl text-white bg-dark-gray`}>
            <div className="grow flex items-center gap-4">
                <Image  className="w-[48px] h-[48px] rounded-full self-center"  src={user.image}    width={1000}  height={1000}   alt="user image"
                />
                <h3>{user.name}</h3> 
            </div>
            <div className="flex items-center gap-4">
                <Image className="" src="/icons/navBar/chat.svg" width={24} height={24} alt="chat"/>
                <Image className="" src="/icons/navBar/game.svg" width={24} height={24} alt="challenge"
                />
            </div>
        </div>
    );
}