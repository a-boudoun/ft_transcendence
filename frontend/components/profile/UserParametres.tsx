"use client";

import Link from 'next/link'
import AddFriend  from '@/components/profile/AddFriend'
import { use, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useSelector } from 'react-redux';
import socket from '../socketG';
import useCloseOutSide from '@/hookes/useCloseOutSide';
import axios from '@/apis/axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

  const Challnege = ({username} : {username: string}) => {
      return(
        <button className='bg-blue px-3 py-1 text-black rounded-xl' onClick={() => {socket.emit('invite-freind', username)}}>Challnege</button>
      )
  }
  
  const Block = ({username} : {username: string}) => {
    const router = useRouter();

    const block = useMutation({
      mutationFn: async(name: string) => {
        const {data} = await axios.post(`/users/block`, {username: username});
        return data;
      },
      onSuccess: () => {
        router.push('/profile');
      }
    });

    const handleClick = async () => { 
      await block.mutate(username);
    }

    return(
      <button className='bg-red px-3 py-1 text-black rounded-xl' onClick={handleClick} >Block</button>
    )
  }

  const Drop = ({setIsOpen} : {setIsOpen : (isOpen: boolean) => void}) => {
    const user  = useSelector((state: any) => state.currentChannel.visitedUser);
    const {divref} = useCloseOutSide({setIsOpen});

    return(
        <div ref={divref}
          className='w-36 absolute bottom-6 right-6 text-sm flex flex-col gap-2 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-2 rounded-2xl'>
          <AddFriend name={user.name}/>
          <Link className='bg-blue px-3 py-[5px] text-black rounded-xl' href={`/chat/${user.name}`}>Mesage</Link>
          <Challnege username={user.username} />
          <Block username={user.username} />
       </div>  
    )
  } 
  
const UserParametres = () => {
   
    const [isOpen, setIsOpen] = useState<boolean>(false);
   

    return(
      <div className='absolute bottom-6 right-6'>
        <button onClick={() => setIsOpen(!isOpen)}>
          <MoreVertical color="white" strokeWidth={4} />
        </button>
        {isOpen && <Drop setIsOpen={setIsOpen}/> }
      </div>
    )
}

export default UserParametres;