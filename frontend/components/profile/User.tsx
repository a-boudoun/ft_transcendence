'use client'

import Image from 'next/image'
import {userDto}  from '@/dto/userDto'
import uploadImage from '@/apis/uploadImage'
import { useQuery, useMutation} from "@tanstack/react-query";
import axios from '@/apis/axios';
import { Client } from '@/providers/QueryProvider';
import { Loader2 } from  'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setVisitedUser } from '@/redux/features/currentChannel';
import AddFriend from '@/components/profile/AddFriend';
import UserParametres from '@/components/profile/UserParametres';

const User = ({id} : {id : string | null}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const User = useQuery({
    queryKey: ['user'],
    queryFn: async ()=> {
      (id ? id = id : id = 'me')
      const {data} = await axios.get(`/users/getUser/${id}`)
      dispatch(setVisitedUser(data));
      return data;
    }
  });

  const updateBaner = useMutation({
    mutationKey: ['updateBaner'],
    mutationFn: async(user : userDto) => {
      await axios.patch('/users/updateMe', user);
    },

    onSuccess: () => {
      Client.refetchQueries('User');
    },

  });

  const status = 'online';

  const handleChange = async (e: any) => {
    setIsLoading(true);
    const user : userDto = {};
    const uploadimage = await uploadImage(e.target.files[0]);
    user.baner = uploadimage;
    await updateBaner.mutate(user);
    await Client.refetchQueries('User');
    setIsLoading(false);
  }

  if (User.isLoading)
    return <div>loading...</div>
  else
  return(
  <div className='relative overflow-hidden sm:rounded-3xl sm:shadow-2xl'>
    <Image className='w-full h-full'  src={User?.data.baner} alt='baner' width={1000} height={1000} />
    { !id && <label className="absolute right-0 bottom-[110px] sm:bottom-[134px] bg-blue text-sm text-black rounded-2xl px-8 py-2 cursor-pointer ">change baner image
                {isLoading && <Loader2 className="absolute top-3 right-2 animate-spin" size={16} strokeWidth={1.2} />}
                <input type="file" className='hidden' accept="image/jpeg, image/jpg, image/png, image/webp" onChange={handleChange}/>
            </label>
    }
    <div className='absolute flex gap-4 items-center bottom-0 w-full bg-black/50 p-3 sm:p-6'> 
        <Image className='rounded-full w-[86px] h-[86px]'  src={User?.data.image} alt='img' width={1000} height={1000} />
        <div className='flex flex-col items-start gap-1'>
              <h2 className='text-white text-xl sm:text-3xl'>{User?.data.name}</h2>
            { id &&   <div className='flex gap-2 text-sm'>
                           <span className='text-green-500 sm:text-xl'>{status}</span> 
                      </div>
            }
        </div>
    </div>
    {id && <UserParametres id={id}/> }
  </div>
  )
}

export default User;