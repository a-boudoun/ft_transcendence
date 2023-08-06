"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const FriendRequest = () => {
  const [notif, setNotif] = useState<number>(6);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {data, isLoading} = useQuery({
    queryKey: "friendRequest",
    queryFn: async() => {
      const {data} = await axios.get('localhost:3000/users/friendRequest');
      return data;
    }
  })

  console.log(data);

  const handelClick = () => {
    setNotif(0);
    setIsOpen(!isOpen);
  }

  return (
    <>
        <button className='relative grid place-content-center mr-[14px] p-2' onClick={handelClick}>
            <Image src={'/icons/navBar/notification.svg'} alt={"notification"} width={28} height={28} />
          { notif != 0 &&
             <div className="absolute top-0 right-0 bg-red rounded-full text-sm px-2"> {notif > 9 ? '9+' : notif } </div> 
          }
        </button>
        {
            isOpen  &&
                  (<div className='flex flex-col justify-around absolute top-[56px] right-0 w-[400px] p-[168px] bg-light-gray'>

              </div>)
        } 
    </>
  )
}

export default FriendRequest;
