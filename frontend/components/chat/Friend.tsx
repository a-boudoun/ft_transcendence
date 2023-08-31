"use client";
import userDto from "@/dto/userDto";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";


const Friends = () => {
    const[friends, setFriends] = useState<userDto[]>([]);
    const {data, isLoading} = useQuery({
        queryKey: ['friends'],
        queryFn: async ()=> {
            const { data } = await axios.get('http://localhost:8000/friendship/getFriends', { withCredentials: true });
            return data;
        }
      });

    useEffect(() => {
        if (data) {
            setFriends(data);
        }
    }, [data]);
    console.log(friends);
    return (

        <div className="h-[90%] overflow-y-scroll py-2 ">
            {
                friends?.map((friend: userDto) => (
                    <Link key={friend.id} href={`/chat/${friend.id}`}>
                        <Friend key={friend.id} friend={friend} />
                    </Link>
                ))
            }
        </div>

    );
}

export default Friends;


export const Friend = ({friend}:{friend:userDto}) => {
    return (
        <div className={`bg-dark-gray h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white flex justify-between`}>
            <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-5">
                    <Image
                        className="w-10 h-10 rounded-full self-center"
                        src={friend.image}
                        alt="user"
                        width={100}
                        height={100}
                    />
                    <h1>{friend.username}</h1>
                </div>
            </div>
        </div>

    );
}