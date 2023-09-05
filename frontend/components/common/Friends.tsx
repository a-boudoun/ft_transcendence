'use client'

import Image from 'next/image';
import Link from "next/link";
import userDto from "@/dto/userDto";
import axios from '@/apis/axios';
import { useQuery } from "@tanstack/react-query";
import socket from '../socketG';

const Friends = ({id} : {id : string | null}) => {
    const {data, isLoading} = useQuery({
        queryKey: ['friends'],
        queryFn: async ()=> {
            (id ? id = id : id = 'me')
            const { data } = await axios.get(`/friendship/getFriends/${id}`);
            return data;
        }
      });
   
      if (isLoading) 
        return <div className="">loading... </div>
      else {
        return (
            <div className="flex flex-col gap-4">
                <div className={'h-full flex flex-col gap-1 overflow-y-scroll rounded-2xl'}>
                    {
                        data.map((friend: userDto) => {
                            console.log(friend);
                            return (
                                <Link href={`/profile/${friend.name}`} >
                                    <Friend user={friend} id={id} /> 
                                </Link>
                            );
                        })
                    }   
                </div>
            </div>
        );
    }
}
export default Friends;

export const Friend = ({user, id}: {user: userDto, id: string}) => {
    return (
        <div className='flex justify-between px-4 py-2 mx-2 rounded-xl bg-dark-gray'>
            <div className="grow flex items-center gap-4">
                <Image  className="w-[48px] h-[48px] rounded-full self-center"  src={user.image}    width={1000}  height={1000}   alt="user image"
                />
                <h3>{user.name}</h3> 
            </div>
            {
               !id &&  <div className="flex items-center gap-4">
                    <Image className="" src="/icons/navBar/chat.svg" width={24} height={24} alt="chat"/>
                    <button onClick={() => {socket.emit('invite-freind', user.username)}}>
                        <Image className="" src="/icons/navBar/game.svg" width={24} height={24} alt="challenge"/>
                    </button>
                </div>
            }
        </div>
    );
}