'use client'

import Image from 'next/image'
import {userDto}  from '@/dto/userDto'
import uploadImage from '@/apis/uploadImage'
import { useQuery, useMutation} from "@tanstack/react-query";
import axios from 'axios';
import { Client } from '@/Providers/QueryProvider';
import { Loader2 } from  'lucide-react';
import { useState } from 'react';
import AddFriend from './AddFriend';
import Link from 'next/link';
import Block from './Block';

const Challnege = ({id} : {id : string}) => {
  return(
    <button className='bg-blue text-sm px-4 py-[2px] text-black rounded-md'>Challnege</button>
  )
}

const UserParametres = ({id} : {id : string}) => {
  return(
    <div className='flex absolute bottom-0 right-0 p-4  gap-2'>
      <AddFriend id={id} />
      <Link className='bg-blue text-sm px-4 py-[2px] text-black rounded-md' href={`/chat/${id}`}>Mesage</Link>
      <Challnege id={id} />
      <Block id={id} />
    </div>
  )
}

const User = ({id} : {id : string | null}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const User = useQuery({
    queryKey: ['outherUser'],
    queryFn: async ()=> {
      let endpoint = 'http://localhost:8000/users/me';
      if (id)
        endpoint = `http://localhost:8000/users/${id}`;

      const {data} = await axios.get(endpoint, { withCredentials: true })
      return data;
    }
  });

  const updateBaner = useMutation({
    mutationKey: ['updateBaner'],
    mutationFn: async(user : userDto) => {
      await axios.patch('http://localhost:8000/users/updateMe', user, { withCredentials: true });
    },

    onSuccess: () => {
      Client.refetchQueries('user');
    },

  });

  const status = 'online';

  const handleChange = async (e: any) => {
    setIsLoading(true);
    const user : userDto = {};
    const uploadimage = await uploadImage(e.target.files[0]);
    user.baner = uploadimage;
    await updateBaner.mutate(user);
    await Client.refetchQueries('user');
    setIsLoading(false);
  }

  if (User.isLoading)
    return <div>loading...</div>
  else
  return(
  <div className='relative overflow-hidden sm:rounded-3xl sm:shadow-2xl'>
    <Image className='w-full h-full'  src={User?.data.baner} alt='baner' width={1000} height={1000} />
    { !id && <label className="absolute right-0 bottom-28 bg-blue text-sm text-black rounded-2xl px-8 py-2 cursor-pointer  sm:bottom-36 ">change baner image
                {isLoading && <Loader2 className="absolute top-3 right-2 animate-spin" size={16} strokeWidth={1.2} />}
                <input type="file" className='hidden' accept="image/jpeg, image/jpg, image/png, image/webp" onChange={handleChange}/>
            </label>
    }
      <div className='absolute flex gap-3 items-center bottom-0 w-full bg-black/70 p-[14px]'> 
      <Image className='rounded-full w-[86px] h-[86px] sm:m-4'  src={User?.data.image} alt='img' width={1000} height={1000} />
      <div className='text-left'>
        <h2 className='text-white text-xl sm:text-3xl'>{User?.data.name}</h2>
        {id && <div className='flex items-center'>
                  <span className='text-green-500 sm:text-xl'>{status}</span>
                  <AddFriend id={id} />
                </div>
        }
      </div>
    </div> 
  </div>
  )
}

export default User;