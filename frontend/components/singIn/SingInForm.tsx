"use client";

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import gt from '@/apis/PatchInclient';
import userDto from '@/dto/userDto';
import { useRouter } from 'next/navigation'



const SingInForm = ({user} : {user: any}) => {

    const Router = useRouter();

    const [imageSrc, setimageSrc] = useState<any>(user.image);
    const [name, setName] = useState<string>(user.name);
    
    const handleChange = (e: any) => {
      if (e.target.files)
        setimageSrc(URL.createObjectURL(e.target.files[0]));
      else
        setName(e.target.value);
    };

    const handleSubmit = async(e: any) => {
      e.preventDefault();
    
      user.name = name;
      user.image = imageSrc;
    
      await gt('/users/updateMe', user);

      Router.push('/home');

    };

  return (
    <form className='flex flex-col gap-11' onChange={handleChange} onSubmit={handleSubmit}>
      <label>
        <div className='relative hover:opacity-60'>
            <Image className='w-[200px] h-[200px] rounded-full cursor-pointer' src={imageSrc} width={1000} height={1000} alt="avatar"/>
            <Image className='absolute bottom-5 right-0' src={"/icons/changeImage.svg"} width={32} height={32} alt="" />
            <input type="file" className="hidden" onChange={handleChange}/>
        </div>
      </label>
      <input className="h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-black focus:border-[2px] hover:opacity-60" type="text" placeholder={user.name}/>
      <button className="mt-12 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60" type='submit' >let's play</button>
    </form>
  )
}

export default SingInForm;