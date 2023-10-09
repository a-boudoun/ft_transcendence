import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisopen } from '@/redux/features/globalState';
import axios from '@/apis/axios';
import { Client } from '@/providers/QueryProvider';
import { useEffect, useState } from 'react';
import useAmiski from "@/hookes/useAmsiki";
import Image from 'next/image';
import { set } from 'zod';


interface updateChannel{
    name?:string;
    image?:string;
    type?:string;
    password?:string;
  }

export const UpdateChannel = ({type}:{type:string}) => {
    const dispatch = useDispatch<AppDispatch>();
    const channel = useSelector((state: any) => state.globalState.channel);
    const uchannel : updateChannel = { };
    const [name, setName] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>(channel.image);
    const [image, setImage] = useState<any>(null);
    const [isclicked, setIsclicked] = useState<boolean>(false);
    const [typeCh, setTypeCh] = useState<string>(channel.type);
    const [password, setPassword] = useState('');
    const isopen = useSelector((state: any) => state.globalState.isopen);
    const {divref} = useAmiski();
    const [passwordError, setPasswordError] = useState('');
    const [imageError, setImageError] = useState('');
    const [imageExtention, setImageExtention] = useState<string[]>(['png', 'jpg', 'jpeg', 'webp']);
    
    useEffect(() => {
      uchannel.name = channel.name;
      uchannel.image = channel.image;
      uchannel.type = channel.type;
      uchannel.password = channel.password;

      setTypeCh(channel.type);
      setImagePreview(channel.image);

      return () => {
        setImagePreview(channel.image);
        setName('');
        setPassword('');
        setTypeCh(channel.type);
      }
    }, [channel.image, channel.name, channel.type, channel.password]);

    const handleChange = (e: any) => {
      if(e.target.files[0] && !imageExtention.includes(e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1]))
      {
          setImageError('Only .jpg, .jpeg, .png and .webp formats are supported.')
          e.target.value = null;
          return;
      }
          setImageError('');
        setImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleType = (e: any) => {
      setTypeCh(e.target.innerText);
      setIsclicked(!isclicked);
    }
    const updatchanel = useMutation({
      mutationFn: async (uchannel: updateChannel) => {
          const { data } = await axios.patch(`/channels/${channel.id}`, uchannel, { withCredentials: true });
          Client.refetchQueries(['channel']);
          return data;
      },
      onSuccess: (data: any) => {
          Client.refetchQueries(['channels']);
      }
  }); 
    const handelsubmit = async(e: any) => {
      e.preventDefault();
     
      if (typeCh === 'Protected' && password.length < 8)
      {
          if(channel.type === 'Protected' && password != '' )
          {
            setPasswordError('Password must be at least 8 characters');
            return;
          }
      }
      setPasswordError('');


      let img : string = '';

      const formdata = new FormData();
      if(image)
      {
        formdata.append('file', image);
        formdata.append('upload_preset', 'pofiles_images');
        const endpoint = 'https://api.cloudinary.com/v1_1/dwif6n6z6/image/upload';
        const res = await fetch(endpoint, {
            method: 'POST',
            body: formdata,
        });
        const data = await res.json();
        img = data.secure_url;
      }
    
      if(name)
          uchannel.name = name;
      if(img !== channel.image && img !== '')
          uchannel.image = img;
      if(typeCh !== channel.type)
          uchannel.type = typeCh;
      if(typeCh === 'Protected' && password !== channel.password)
          uchannel.password = password;
      updatchanel.mutate(uchannel);
      setImagePreview(channel.image);
      setName('');
      setPassword('');
      setTypeCh(channel.type);
      dispatch(setisopen(false));
    }

    useEffect(() => {
      return () => {
        setImagePreview(channel.image);
        setName('');
        setPassword('');
        setTypeCh(channel.type);
        setImageError('');
      }
    }, [isopen]);
    
    return(
      <div >
        <form 
        className={`w-96 h-[520px]  bg-black bg-opacity-40 ackdrop-blur-lg drop-shadow-lg rounded-lg ${type !== 'settings' ? 'hidden': ''}`} onSubmit={handelsubmit}>
          <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold">Update Channel</h1>
          <div className="absolute left-0 right-0 top-14  w-32 h-32 mx-auto ">
            <label htmlFor="update" className="">
      `        <Image
                className=" h-32 w-32  rounded-full mx-auto absolute left-0 right-0 top-0 cursor-pointer"
                src={imagePreview}
                width={1000}
                height={1000}
                alt=""
                />
            </label>
            <input type="file"  className="hidden" id="update" onChange={handleChange}/>
          </div>
          <span className='absolute right-0 left-0 mx-auto top-48 text-red'>{imageError}</span>
          <input type="txt" value={name} className={`w-3/4 absolute top-[46%] left-0 right-0 mx-auto rounded-md py-2 px-2 outline-none text-md bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg text-white`} placeholder="Change Name" onChange={(e: any)=> setName(e.target.value)}/>
          <button type='button'  className="absolute top-[56%] right-0 left-0 mx-auto w-3/4 py-1.5 rounded-md text-md inline-flex items-center justify-center bg-blue text-white"  onClick={()=> setIsclicked(!isclicked)}>
                  <span>{typeCh}</span>
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
          <div className={`${isclicked ? '': 'hidden'} absolute top-[64%] left-0 right-0 mx-auto py-2  w-3/4 rounded-lg  bg-blue text-white z-20`}>
              <div className='flex flex-col'>
                  <button type='button' onClick={handleType}> <h1 className='hover:bg-white hover:bg-opacity-10 py-1'>Public</h1></button>
                  <button type='button' onClick={handleType}><h1 className='hover:bg-white hover:bg-opacity-10  py-1'>Private</h1></button>
                  <button type='button' onClick={handleType}><h1 className='hover:bg-white hover:bg-opacity-10 py-1'>Protected</h1></button>
              </div>
          </div>
          <input  required={typeCh === 'Protected' && channel.type !== 'Protected' } type='password' value={password} className={`${typeCh !== 'Protected' ? 'hidden' : ''} absolute top-[65%] left-0 right-0 mx-auto w-3/4 text-md  rounded-md  py-2 px-2   bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg text-white outline-none z-10`} placeholder='Password'  onChange={(e:any)=> setPassword(e.target.value)}/>
          <div className='absolute right-0 left-0 mx-auto bottom-28 text-red'>{passwordError}</div>
          <div className="absolute bottom-0 left-0 right-0 mx-auto ">
              <button className=" w-[46%] absolute bottom-0 left-1 bg-blue text-white font-semibold text-base my-2 py-1  rounded-lg" onClick={()=> dispatch(setisopen(false))} >Cancel</button>
              <button className=" w-[46%] absolute bottom-0 right-1 bg-red text-white font-semibold text-base my-2 py-1 rounded-lg"  >Update</button>
          </div>
        </form>
      </div>
    );
  }

  export default UpdateChannel;