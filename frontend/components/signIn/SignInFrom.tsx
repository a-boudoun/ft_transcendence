"use client";

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import patch from '@/apis/client/patch';
import { useRouter } from 'next/navigation';
import { config } from 'dotenv';

config();

const SignInFrom = ({user} : {user: any}) => {

  const Router = useRouter();

  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>(user.name);
  const [imagePreview, setImagePreview] = useState<string>(user.image);
  
  const handleChange = (e: any) => {
    if (e.target.files){
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    else
      setName(e.target.value);
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    const formdata = new FormData();

    if (image)
    {
      formdata.append('file', image);
      formdata.append('upload_preset', 'pofiles_images');
      const endpoint = 'https://api.cloudinary.com/v1_1/dwif6n6z6/image/upload';
      const res = await fetch(endpoint, {
          method: 'POST',
          body: formdata,
      });
      const data = await res.json();
      user.image = data.secure_url;
    }

    
    user.name = name;
    user.image = imagePreview;
    await patch('/users/updateMe', user);
  
    Router.push('/home');
  };

  return (
    <form className='flex flex-col gap-11' onChange={handleChange} onSubmit={handleSubmit} >
      <label>
        <div className='relative hover:opacity-60'>
            <Image className='w-[200px] h-[200px] rounded-full cursor-pointer' src={imagePreview} width={1000} height={1000} alt="avatar"/>
            <Image className='absolute bottom-5 right-0' src={"/icons/changeImage.svg"} width={32} height={32} alt="" />
            <input type="file" className="hidden"/>
        </div>
      </label>
      <input className="h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-black focus:border-[2px] hover:opacity-60" type="text" placeholder={user.name}/>
      <button className="mt-12 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60" type='submit' >let's play</button>
    </form>
  )
}

export default SignInFrom;