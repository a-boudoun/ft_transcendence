"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { stat } from "fs";
import { userDto } from "@/dto/userDto";


const FriendRequest = () => {
  const [notif, setNotif] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {data, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: async() => {
      const {data} = await axios.get('http://localhost:8000/users', {withCredentials: true});
      return data;
    }
  })

  const handelClick = () => {
    setNotif(false);
    setIsOpen(!isOpen);
  }
  
  const FriendRequestItem = ({user}: {user: userDto}) => {
      console.log(user);
      <div className='flex items-center'>
        <Image src={user.image} alt={user.name} width={28} height={28} />
        <p className='text-sm font-bold'>{user.name}</p>
        <button>dine</button>
        <button>accept</button>
      </div>
  }

  return (
    <>
        <button className='relative grid place-content-center mr-[14px] p-1' onClick={handelClick}>
            <Image src={'/icons/navBar/notification.svg'} alt={"notification"} width={28} height={28} />
            {notif && <div className="absolute h-3 w-3 top-0 right-0 bg-red rounded-full"> </div> }
        </button>
        {
            isOpen  &&
            (<div className='absolute right-0 top-[56px] flex flex-col justify-around bg-light-gray p-4 rounded-b-xl shadow-2xl'>
                {
                     data.users?.map((user: userDto) => {
                        return (
                          <div className={`flex justify-between bg-dark-gray px-4 py-2 rounded-xl gap-2 sm:gap-8`}>
                              <div className="flex items-center gap-4">
                                  <Image  className=" sm:w-[48px] sm:h-[48px] rounded-full self-center"  src={user.image} width={36}  height={36} alt="user image"/>
                                  <div className="text-left">
                                    <h3 className="text-[12px] sm:text-[24px]" >{user.name}</h3> 
                                    <p className="text-[6px] sm:text-[8px] ">sent you a friend request</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 text-[12px] sm:gap-4 sm:text[24px]">
                                  <button className="bg-red rounded-xl px-2 py-1 sm:px-4 sm:py-2">Decline</button>
                                  <button className="bg-blue rounded-xl px-2 py-1 sm:px-4 sm:py-2">Accept</button>
                              </div>
                        </div>
                        );
                    })
                }  
            </div>)
        } 
    </>
  )
}



export default FriendRequest;
