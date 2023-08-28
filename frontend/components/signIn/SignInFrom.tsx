"use client";

import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { config } from 'dotenv';
import uploadImage from '@/apis/uploadImage';
import { signInDto } from '@/dto/userDto';
import { signInSchema } from '@/models/user';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from  'lucide-react';


config();

const SignInFrom = ({user} : {user: signInDto}) => {

  const Router = useRouter();

  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>(user.name);
  const [imagePreview, setImagePreview] = useState<string>(user.image);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateUser = useMutation({
    mutationFn: async(user : signInDto) => {
      await axios.patch('http://localhost:8000/auth/singin', user, { withCredentials: true });
    },
    onSuccess: () => {
      Router.push('/profile');
    },
  });

  const handleChange = async (e: any) => {
    if (e.target.files){
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    else if (e.target.value.length > 0)
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
      await updateUser.mutate(user);
    }
    else
    {
      setIsLoading(false);
      setErrors(validationResult.error.issues);
    }
  };

  return (
    <>
    <form className='flex flex-col gap-11' onChange={handleChange} onSubmit={handleSubmit} >
      <label>
        <div className='relative hover:opacity-60'>
            <Image className='w-[200px] h-[200px] rounded-full cursor-pointer' src={imagePreview} width={1000} height={1000} alt="avatar" />
            <Image className='absolute bottom-5 right-0' src={"/icons/changeImage.svg"} width={32} height={32} alt="" />
            <input type="file" className="hidden" accept="image/jpeg, image/jpg, image/png, image/webp" />
        </div>
      </label>
      <input id={'name'} className="h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-black focus:border-[2px] hover:opacity-60" type="text" placeholder={user.name}/>
      <button className="relative mt-12 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60" type='submit' onClick={ () => setIsLoading(true)} >let's play
      {isLoading && <Loader2 className="absolute top-6 right-6 animate-spin" size={20} strokeWidth={1.2} />}
      </button>
    </form>
    {errors.length > 0 && <p className='text-red text-center max-w-[200px]'>{errors[0].message}</p>}
    </>
  )
}

export default SignInFrom;