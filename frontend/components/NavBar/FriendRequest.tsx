"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation} from "@tanstack/react-query";
import axios from "@/apis/axios";
import { userDto } from "@/dto/userDto";
import { Client } from "@/providers/QueryProvider";
import useCloseOutSide from "@/hookes/useCloseOutSide";
interface Props {
  users : userDto[];
  setIsOpen : (isOpen: boolean) => void;
}

const FriendRequestDropdown = ({users, setIsOpen} : Props) => {
  const {divref} = useCloseOutSide({setIsOpen});

  const Accept = useMutation({
    mutationKey: ['acceptFriendRequest'],
    mutationFn: async(sender: number) => {
      const {data} = await axios.patch(`/friendship/acceptRequest`, {sender: sender});
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries('friendrequests');
    }
  })

  const Decline  = useMutation({
    mutationKey: ['DeclineFriend'],
    mutationFn: async(id: number) => {
        const {data} = await axios.delete(`/friendship/${id}`);
        return data;
    },
    onSuccess: () => {
        Client.refetchQueries('friendrequests');
    }
  });

  return (
  <div ref={divref}
  className='absolute right-0 top-[56px] max-h-[200px] p-4 flex flex-col gap-1 overflow-y-scroll rounded-b-2xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg'>
    {users.length === 0 ? <p className="text-center">No friend requests</p> :
        users.map((user: userDto) => {
            return (
              <div className={`flex justify-between bg-dark-gray px-4 py-2 rounded-xl gap-2 sm:gap-8`}>
                  <div className="flex items-center gap-4">
                      <Image  className=" sm:w-[48px] sm:h-[48px] rounded-full self-center"  src={user.image} width={36}  height={36} alt="user image"/>
                      <div className="text-left">
                        <h3 className="text-[12px] sm:text-[24px]" >{user.username}</h3> 
                        <p className="text-[6px] sm:text-[8px] ">sent you a friend request</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] sm:gap-4 sm:text[24px]">
                      <button className="bg-red rounded-xl px-2 py-1 sm:px-4 sm:py-2" onClick={() =>  Decline.mutate(user.id)} >Decline</button>
                      <button className="bg-blue rounded-xl px-2 py-1 sm:px-4 sm:py-2" onClick={() =>  Accept.mutate(user.id)} >Accept</button>
                  </div>
            </div>
            );
        })
    }  
  </div>)
}

const FriendRequest = () => {
  const [notif, setNotif] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {data} = useQuery({
    queryKey: ['friendrequests'],
    queryFn: async() => {
      const {data} = await axios.get('/friendship/friendrequests');
      if (data.length > 0)
        setNotif(true);
      return data;
    }
  })

  const handelClick = () => {
    setNotif(false);
    setIsOpen(!isOpen);
  }

  return (
    <>
        <button className='relative grid place-content-center mr-[14px] p-1' onClick={handelClick}>
            <Image src={'/icons/navBar/notification.svg'} alt={"notification"} width={28} height={28} />
            {notif && <div className="absolute h-3 w-3 top-0 right-0 bg-red rounded-full"> </div> }
        </button>
        {
            isOpen  && <FriendRequestDropdown users={data} setIsOpen={setIsOpen}/>
        } 
    </>
  )
}

export default FriendRequest;