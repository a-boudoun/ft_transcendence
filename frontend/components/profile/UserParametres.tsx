"use client";

import Link from 'next/link'
import AddFriend  from '@/components/profile/AddFriend'
import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

const Challnege = ({id} : {id : string}) => {
    return(
      <button className='bg-blue px-3 py-1 text-black rounded-xl'>Challnege</button>
    )
  }
  
  const Block = ({id} : {id : string}) => {
    return(
      <button className='bg-red px-3 py-1 text-black rounded-xl'>Block</button>
    )
  }
  
const UserParametres = ({id} : {id : string}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return(
      <div className='absolute bottom-6 right-6'>
        <button onClick={() => setIsOpen(!isOpen)}>
          <MoreVertical color="white" strokeWidth={4} />
        </button>
        {isOpen &&<div className='w-36 absolute bottom-6 right-6 text-sm flex flex-col gap-2 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-2 rounded-2xl'>
                    <AddFriend id={id}/>
                    <Link className='bg-blue px-3 py-[5px] text-black rounded-xl' href={`/chat/${id}`}>Mesage</Link>
                    <Challnege id={id} />
                    <Block id={id} />
              </div>  
        }
      </div>
    )
}

export default UserParametres;