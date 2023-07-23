'use client'

import Image from 'next/image';
import { useState } from 'react';
import  channelDto  from '@/dto/channelDto'
import postChannel from '@/apis/client/postChannel';

const NewChannel = () => {
    const [isclicked, setIsclicked] = useState(false);
    const [name , setName] = useState('')
    const [password , setPassword] = useState('')
    const [type, setType] = useState('Public');
    const [image, setImage] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string>('/img/profile.svg');

    const handleclick = () => {
        setIsclicked(!isclicked);
    }

    const handleType = (e: any) => {
        setType(e.target.innerText);
        setIsclicked(!isclicked);
    }



    const handleChange = (e: any) => {
        if (e.target.files){
          setImage(e.target.files[0]);
          setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
        else if (e.target.id === 'name')
          setName(e.target.value)
        else
            setPassword(e.target.value)
      };



      const handleSubmit = async(e: any) => {
        e.preventDefault();
        setImagePreview('/img/profile.svg');
        setName('');
        setPassword('');

        let channel : channelDto = {}

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
          console.log(data.secure_url);
          channel.image = data.secure_url;
        }
        else
            channel.image = '/img/profile.svg';
        
        channel.name = name;
        channel.password = password;
        channel.type = type;

        await postChannel('/channels/createChannel', channel);
    
    }
    return (

        <form className=' w-full bg-dark-gray p-4 rounded-xl ' onChange={handleChange} onSubmit={handleSubmit}>
            <div className='w-fit mx-auto my-3 hover:opacity-60'>
                <label htmlFor="id" className='bg-red'>
                <Image className='rounded-full cursor-pointer w-[150px] h-[150px]' src={imagePreview} width={150} height={150} alt="avatar" />
              </label>  <input type="file" className="hidden" id='id' />
            </div>
            <input required id={'name'} className='w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none' placeholder='Name of channel' value={name} />
            <button type='button'  className="hover:opacity-60 text-white w-full  rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center justify-center bg-blue" onClick={handleclick}>
                {type}
                <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            <div className={` ${isclicked === true ? '' : 'hidden'}  py-2 my-2 rounded-lg divide-y divide-gray-100 shadow w-full bg-blue bg-opacity-60 `}>
                <div className='flex flex-col'>


                    <button type='button' onClick={handleType}> <h1 className='hover:bg-white hover:bg-opacity-10 py-1'>Public</h1></button>
                    <button type='button' onClick={handleType}><h1 className='hover:bg-white hover:bg-opacity-10  py-1'>Private</h1></button>
                    <button type='button' onClick={handleType}><h1 className='hover:bg-white hover:bg-opacity-10 py-1'>Protected</h1></button>


                </div>
            </div>
            <input  required={type === 'Protected'} type='password' value={password} className={`${type !== 'Protected' ? 'hidden' : ''} w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none`} placeholder='Password' />
            <button className='bg-red w-full mt-5 rounded-lg py-2 hover:opacity-60'>Create</button>
        </form>

    )
}

export default NewChannel;