'use client'

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Client  } from '@/Providers/QueryProvider';

const UpdateForm = () => {

  const User = useQuery({
    queryKey: ['user'],
    queryFn: async ()=> {
      const {data} = await axios.get('http://localhost:8000/users/me', { withCredentials: true })
      return data;
    }
  });
  
  const [image, setImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>(user.image);
  const [name, setName] = useState<string>(user.name);

    return (
        <>
        <form className='flex items-center gap-8'>
          <label>
            <div className='relative hover:opacity-60'>
                <Image className='w-[200px] h-[200px] rounded-full cursor-pointer' src={imagePreview} width={1000} height={1000} alt="avatar" />
                <Image className='absolute bottom-5 right-0' src={"/icons/changeImage.svg"} width={32} height={32} alt="" />
                <input type="file" className="hidden" accept="image/jpeg, image/jpg, image/png, image/webp" />
            </div>
          </label>
          <input id={'name'} className="h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-black focus:border-[2px] hover:opacity-60" type="text" placeholder={user.name}/>
        </form>
        {/* {errors.length > 0 && <p className='text-red text-center max-w-[200px]'>{errors[0].message}</p>} */}
        </>
  )
}

export default UpdateForm;