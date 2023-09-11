'use client'

import Image from 'next/image';
import { useState } from 'react';
import  channelDto  from '@/dto/channelDto'
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setcurrentchannel, setnewchannel } from '@/redux/features/globalState';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NewChannel = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const owner = useSelector((state: any) => state.globalState.user);
    const [isclicked, setIsclicked] = useState(false);
    const [name , setName] = useState('')
    const [password , setPassword] = useState('')
    const [type, setType] = useState('Public');
    const [image, setImage] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string>('/img/a.jpeg');
    
    const handleclick = () => {
        setIsclicked(!isclicked);
    }

    const handleType = (e: any) => {
        setType(e.target.innerText);
        setIsclicked(!isclicked);
    }

    const handleChange = (e: any) => {
          setImage(e.target.files[0]);
          setImagePreview(URL.createObjectURL(e.target.files[0]));
      };

      const NewChannel = useMutation(async(channel : channelDto) => {
            const res = await axios.post('http://localhost:8000/channels/createChannel', {name : channel.name, image: channel.image,  type: channel.type, password: channel.password, owner: channel.owner}, { withCredentials: true });
            
            return res.data;
        },
        {
        onSuccess: (data: any) => {
           
            dispatch(setnewchannel(data));
            dispatch(setcurrentchannel(data));
            router.push(`/channel/${data.id}`);

        },           
    });
      const handleSubmit = async(e: any) => {
        e.preventDefault();
        setImagePreview('/img/a.jpeg');
        setName('');
        setPassword('');

        let channel:channelDto = {};

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
        
          channel.image = data.secure_url;
        }
        else
            channel.image = '/img/a.jpeg';
        
        channel.name = name;
        channel.password = password;
        channel.type = type;
        channel.owner = owner;
        NewChannel.mutate(channel);

    }
    return (

        <form className=' w-full bg-dark-gray p-4 rounded-xl '  onSubmit={handleSubmit}>
            <div className='w-fit mx-auto my-3 hover:opacity-60'>
                <label htmlFor="id" className='bg-red'>
                <Image className='rounded-full cursor-pointer w-[150px] h-[150px]' src={imagePreview} width={150} height={150} alt="avatar" />
              </label> 
              <input type="file" className="hidden" id='id' onChange={handleChange} />
            </div>
            <input required id={'name'} className='w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none' placeholder='Name of channel' value={name} onChange={(e:any)=> setName(e.target.value)}/>
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
            <input  required={type === 'Protected'} type='password' value={password} className={`${type !== 'Protected' ? 'hidden' : ''} w-full rounded-lg px-5 py-2 text-lg bg-light-gray my-2 outline-none`} placeholder='Password' onChange={(e:any)=> setPassword(e.target.value)}/>
            <button className='bg-red w-full mt-5 rounded-lg py-2 hover:opacity-60'>Create</button>
        </form>

    )
}

export default NewChannel;