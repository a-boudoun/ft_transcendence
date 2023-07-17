"use client";

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import patchUser from '@/apis/client/patchUser';
import { useRouter } from 'next/navigation';
import { config } from 'dotenv';
import uploadImage from '@/apis/uploadImage';
import { signInDto } from '@/dto/userDto';
import { signInSchema } from '@/models/user';
import { z } from 'zod';

config();

const SignInFrom = ({user} : {user: signInDto}) => {

  const Router = useRouter();

  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>(user.name);
  const [imagePreview, setImagePreview] = useState<string>(user.image);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  
  const handleChange = async (e: any) => {

    if (e.target.files){
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    else
      setName(e.target.value);
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();
  

    const validationResult = await signInSchema.safeParseAsync({name: name, image: image});

    if (validationResult.success) {
      user.name = name;
      if (image)
      {
        const uploadimage = await uploadImage(image);
        user.image = uploadimage;
      }
      
      await patchUser('/users/updateMe', user);
      Router.push('/home');
    }
    else
      setErrors(validationResult.error.issues);
  };


  return (
    <>
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
    {errors.length > 0 && <p className='text-red text-center max-w-[200px]'>{errors[0].message}</p>}
    </>
  )
}

export default SignInFrom;