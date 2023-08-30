"use client"
import { use, useState } from "react";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setMembership, setisopen , setisMember, setmodaltype, setcurrentChannel} from "@/redux/features/currentChannel";
import Image from "next/image";
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import userDto from "@/dto/userDto";
import { Client } from '@/providers/QueryProvider';
import { useRouter } from 'next/navigation';
import { set } from "zod";

function Modal() {
  const dispatch = useDispatch<AppDispatch>();
    const modalType:string = useSelector((state: any) => state.currentChannel.modalTYpe);
    const isopen:boolean = useSelector((state: any) => state.currentChannel.isopen);
    return (
     
          <div className={`${isopen === true ? '' : 'hidden'} fixed z-40 inset-0 overflow-y-auto`}>
            <div className="flex items-center justify-center min-h-screen  ">
              <div className="fixed inset-0 bg-gray-600 opacity-60 ">
              </div>
              <div className={`relative rounded-lg  text-black  z-50  `}>
                <button className=" absolute left-0  p-2  cursor-pointer" onClick={() => dispatch(setisopen(false))}>
                  <Image
                    className="h-full rounded-full  "
                    src={'/img/cancel.svg'}
                    width={24}
                    height={24}
                    alt=""
                  />
                </button>
                 <>
                    <JoinChannel type={modalType}/>
                    <UpdateChannel type={modalType}/>
                    <AddFriend type={modalType}/>
                    <LeaveChannel type={modalType}/>
                 </>
              </div>
            </div>
          </div>
      
  
    );
  }
  export default Modal;

  export const JoinChannel = ({type}:{type:string}) => {


    const dispatch = useDispatch<AppDispatch>();
    const [input, setInput] = useState("");
    const channel = useSelector((state: any) => state.currentChannel.channel);
    const user = useSelector((state: any) => state.currentChannel.user);

    const joinChannel = useMutation({
      mutationFn: async (user: userDto) => {
          const { data } = await axios.patch(`http://localhost:8000/channels/${channel.id}/joinChannel`, user, { withCredentials: true });
          const membership = data.memberships?.find((member: any) => member.member?.username === user.username);
          dispatch(setMembership(membership));
          dispatch(setcurrentChannel(data));
          return data;
      },
      onSuccess: () => {
          console.log("joined")
      }
  });

    const onChange = (e: any) => {
      setInput(e.target.value);
    }

    const onClick = () => {
      if(input === channel.password){
        joinChannel.mutate(user);
        dispatch(setisopen(false));
      }
     else{
       alert("wrong password");
     }

  }

    return(
      <div className={`w-96 h-96 bg-slate-700 rounded-lg ${type !== 'joinchannel' ? 'hidden': ''}`}>
        <Image
          className="absolute left-0 right-0 top-10 h-32 w-32  rounded-full mx-auto my-3"
          src={channel.image}
          width={1000}
          height={1000}
          alt=""
        />
        <h1 className="absolute h-1 top-48 left-0 right-0  text-white font-semibold">{channel.name}</h1>
        <input type="password" className={`${channel.type === "Protected" ? '': 'hidden' } w-1/2 absolute top-60 left-24 rounded-md py-1 px-3 outline-none`} placeholder="Enter Password"  onChange={onChange}/>
        <button className=" w-[96%] absolute bottom-0 left-0 bg-blue text-white font-semibold text-base m-2 py-1 rounded-lg" onClick={onClick}>Join</button>
      </div>
    );
  }

  interface updateChannel{
    name:string;
    image:string;
    type:string;
    password:string;
  }
  export const UpdateChannel = ({type}:{type:string}) => {
    const dispatch = useDispatch<AppDispatch>();
    const channel = useSelector((state: any) => state.currentChannel.channel);
    const uchannel : updateChannel = { name: channel.name, image: channel.image, type: channel.type, password:channel.password};
    const [name, setName] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>(channel.image);
    const [image, setImage] = useState<any>(null);
    const [isclicked, setIsclicked] = useState<boolean>(false);
    const [typeCh, setTypeCh] = useState<string>(channel.type);
    const [password, setPassword] = useState('');
    
    useEffect(() => {
      setTypeCh(channel.type);
      setImagePreview(channel.image);
      setName(channel.name);
      // setPassword(channel.password);
    }, [channel]);

    const handleChange = (e: any) => {
        setImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleType = (e: any) => {
      setTypeCh(e.target.innerText);
      setIsclicked(!isclicked);
    }
    const updatchanel = useMutation({
      mutationFn: async (uchannel: updateChannel) => {
          const { data } = await axios.patch(`http://localhost:8000/channels/${channel.id}`, uchannel, { withCredentials: true });
          return data;
      },
      onSuccess: () => {
          Client.refetchQueries('channels');
          Client.refetchQueries('channel');
          console.log("joined")
      }
  }); 
    const handelsubmit = async(e: any) => {
      e.preventDefault();
      setImagePreview(channel.image);
      setName('');
      setPassword('');

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
      console.log(uchannel);
      dispatch(setisopen(false));
      
    }
    console.log(typeCh);
    return(
      <form className={`w-96 h-[490px]  bg-slate-700 rounded-lg ${type !== 'settings' ? 'hidden': ''}`} onSubmit={handelsubmit}>
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
          <input type="file" className="hidden" id="update" onChange={handleChange}/>
        </div>
        <input type="txt" className={`w-3/4 absolute top-[46%] left-0 right-0 mx-auto rounded-md py-2 px-2 outline-none text-md bg-gray-500 text-white`} placeholder="Change Name" onChange={(e: any)=> setName(e.target.value)}/>
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
        <input  required={typeCh === 'Protected'} type='password' value={password} className={`${typeCh !== 'Protected' ? 'hidden' : ''} absolute top-[66%] left-0 right-0 mx-auto w-3/4 text-md  rounded-md  py-2 px-2   bg-gray-500 text-white outline-none z-10`} placeholder='Password'  onChange={(e:any)=> setPassword(e.target.value)}/>
        <div className="absolute bottom-0 left-0 right-0 mx-auto ">
            <button className=" w-[46%] absolute bottom-0 left-1 bg-blue text-white font-semibold text-base my-2 py-1  rounded-lg" onClick={()=> dispatch(setisopen(false))} >Cancel</button>
            <button className=" w-[46%] absolute bottom-0 right-1 bg-red text-white font-semibold text-base my-2 py-1 rounded-lg"  >Update</button>
         </div>
      </form>
    );
  }

  export const AddFriend = ({type}:{type:string}) => {
    const dispatch = useDispatch<AppDispatch>();
    return(
      <div className={`w-96 h-96  bg-slate-700 rounded-lg ${type !== 'addFriend' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Invite to chat</h1>

      </div>
    );
  }

  export const LeaveChannel = ({type}:{type:string}) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: any) => state.currentChannel.user);
    const channel = useSelector((state: any) => state.currentChannel.channel);
    const [isowner, setIsowner] = useState(false);

    useEffect(() => {
    const member = channel.memberships?.find((item: any) => item.member?.id === user.id);
    member?.title === 'owner' ? setIsowner(true) : setIsowner(false);
    }, [channel]);

    const leaveChannel = useMutation({
      mutationFn: async (user: userDto) => {
          const member = channel.memberships?.find((item: any) => item.member?.id === user.id);
          const dd = isowner ? channel.id : `${channel.id}/${member.id}`;
          const { data } = await axios.delete(`http://localhost:8000/channels/${dd}`, { withCredentials: true });
          return data;
      },
      onSuccess: () => {
          dispatch(setisopen(false));

          router.push('/channel');
          Client.refetchQueries('channels');
          // Client.refetchQueries('channel');
        }
       
    });
    
    return(
      <div className={`w-96 h-44  bg-slate-700 rounded-lg ${type !== 'leaveChannel' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Leave Channel ?</h1>
         <h5 className="absolute top-16 text-white text-sm px-4">Leaving means you can't send or receive messages in this chat. You can rejoin at any time.</h5>
         <div className="absolute bottom-0 left-0 right-0 mx-auto ">
            <button className=" w-[46%] absolute bottom-0 left-1 bg-blue text-white font-semibold text-base my-2 py-1  rounded-lg" onClick={()=> dispatch(setisopen(false))} >Cancel</button>
            <button className=" w-[46%] absolute bottom-0 right-1 bg-red text-white font-semibold text-base my-2 py-1 rounded-lg" onClick={()=> leaveChannel.mutate(user)} >Leave</button>

         </div>
      </div>
    );
  }