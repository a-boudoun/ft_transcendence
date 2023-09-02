"use client"
import { use, useState } from "react";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setMembership, setisopen , setisMember, setmodaltype, setcurrentChannel, setisNewMember} from "@/redux/features/currentChannel";
import Image from "next/image";
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import userDto from "@/dto/userDto";
import { Client } from '@/providers/QueryProvider';
import { useRouter } from 'next/navigation';
import { set } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAmiski from "@/hookes/useAmsiki";
import React from "react";
import { useDebounce } from "@uidotdev/usehooks"
import { get } from "http";
function Modal() {
  const dispatch = useDispatch<AppDispatch>();
  const showToast = () => {
    toast.success('This is a success notification!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false, // Show or hide the progress bar
      closeOnClick: true,     // Close the toast when clicked
      pauseOnHover: true,     // Pause autoClose on hover
      draggable: true,        // Allow dragging to dismiss
      progress: undefined,
    });
  };
    const modalType:string = useSelector((state: any) => state.currentChannel.modalTYpe);
    const isopen:boolean = useSelector((state: any) => state.currentChannel.isopen);
    const {divref} = useAmiski();
    return (
     
          <div className={`${isopen === true ? '' : 'hidden'} fixed z-40 inset-0 overflow-y-auto`}>
            <div className="flex items-center justify-center min-h-screen  ">
              <div className="fixed inset-0 bg-white opacity-[4%] ">
              </div>
              <ToastContainer />
              <div ref={divref} 
              className={`relative rounded-lg  text-black  z-10  `}>
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
    const showToast = () => {
      toast.error('Wrong password', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
   
    const [input, setInput] = useState("");
    const channel = useSelector((state: any) => state.currentChannel.channel);
    const user = useSelector((state: any) => state.currentChannel.user);
    const [error, setError] = useState('');
    const [isDelayed, setIsDelayed] = useState(false);

    

    const joinChannel = useMutation({
      mutationFn: async (user: userDto) => {
        const dt = {
          user: user,
          password: input,
        }
        console.log(user);
          const { data } = await axios.patch(`http://localhost:8000/channels/${channel.id}/joinChannel`, dt, { withCredentials: true });
          if(data === "Wrong password")
          {
            
            showToast();
            setError("Wrong password");
            
            return;
          }
          else
          {
            const membership = data.memberships?.find((member: any) => member.member?.username === user.username);
            dispatch(setMembership(membership));
            dispatch(setcurrentChannel(data));
            dispatch(setisopen(false));
          }
          return data;
      },
      onSuccess: () => {
          console.log("joined")
      }
  });

    const onChange = (e: any) => {
      setInput(e.target.value);
    }

    const onClick = () => 
    {
        joinChannel.mutate(user)
    }

    return(
      <div className={`shadow-2xl w-96 h-96 bg-slate-700 rounded-lg ${type !== 'joinchannel' ? 'hidden': ''}`}>
        <Image
          className="absolute left-0 right-0 top-10 h-32 w-32  rounded-full mx-auto my-3"
          src={channel.image}
          width={1000}
          height={1000}
          alt=""
        />
        <h1 className="absolute h-1 top-48 left-0 right-0  text-white font-semibold">{channel.name}</h1>
        <input type="password" className={`${channel.type === "Protected" ? '': 'hidden' } w-1/2 absolute top-60 left-24 rounded-md py-1 px-3 outline-none`} placeholder="Enter Password"  onChange={onChange}/>
        <div className="absolute h-1 top-[72%] left-0 right-0 text-[#FF9494]">{error}</div>
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
    const uchannel : updateChannel = { };
    const [name, setName] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>(channel.image);
    const [image, setImage] = useState<any>(null);
    const [isclicked, setIsclicked] = useState<boolean>(false);
    const [typeCh, setTypeCh] = useState<string>(channel.type);
    const [password, setPassword] = useState('');
    const isopen = useSelector((state: any) => state.currentChannel.isopen);
    const {divref} = useAmiski();
    
    useEffect(() => {
      uchannel.name = channel.name;
      uchannel.image = channel.image;
      uchannel.type = channel.type;
      uchannel.password = channel.password;

      setTypeCh(channel.type);
      setImagePreview(channel.image);
      setName(channel.name);
      // setImage(channel.image);
      // setPassword(channel.password);
      return () => {
        setImagePreview(channel.image);
        setName(channel.type  );
      }
    }, [channel.image, channel.name, channel.type, channel.password]);

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
          Client.refetchQueries('channel');
          return data;
      },
      onSuccess: (data: any) => {
          Client.refetchQueries('channels');
          console.log("joined")
      }
  }); 
    const handelsubmit = async(e: any) => {
      e.preventDefault();
      setImagePreview(uchannel.image);
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
      <div >
        <form 
        className={`w-96 h-[490px]  bg-slate-700 rounded-lg ${type !== 'settings' ? 'hidden': ''}`} onSubmit={handelsubmit}>
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
      </div>
    );
  }

  export const AddFriend = ({type}:{type:string}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [friends, setFriends] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const channel = useSelector((state: any) => state.currentChannel.channel);
    

    const debouncedSearchQuery = useDebounce(searchQuery, 600);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const getFriends = useMutation({
          mutationFn: async (channelid: number) => {
            const { data } = await axios.get(`http://localhost:8000/friendship/search/${channelid}/${debouncedSearchQuery}`, { withCredentials: true });
            if(data)
              setFriends(data);
            return data;
          }
      });

      useEffect(() => {
        if(!channel?.id)
          return;
       getFriends.mutate(channel.id);
      }, [debouncedSearchQuery, channel]);

    return(
      <div className={`w-96 h-96  bg-slate-700 rounded-lg ${type !== 'addFriend' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Invite to chat</h1>
         <input type="txt" className="w-11/12 absolute top-14 left-0 right-0 mx-auto rounded-md py-1.5 px-2 outline-none text-md bg-gray-500 text-white" placeholder="Enter Username" value={searchQuery}  onChange={handleInputChange}/>
          <div className="w-11/12 h-[72%] absolute top-[26%] left-0 right-0 mx-auto rounded-md bg-slate-600 overflow-y-scroll">
            { friends &&
              friends?.map((friend: any) => (
                <Friend key={friend.id} friend={friend}/>
              )) 
            }
          </div>
      </div>
    );


  }
  export const Friend = ({friend}:{friend: any}) => {

    const channel = useSelector((state: any) => state.currentChannel.channel);
    const addFriend = useMutation({
      mutationFn: async (channelid: number) => {
          const { data } = await axios.patch(`http://localhost:8000/channels/${channelid}/addFriendtoChannel`, friend, { withCredentials: true });
          return data;
      },
      onSuccess: () => {
          console.log("joined")
          Client.refetchQueries('channels');
          Client.refetchQueries('channel');
      }
  });
 
    return(
      <div className="my-2 mx-auto w-[92%] h-12 bg-dark-gray rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <Image
            className="mx-2 h-8 w-8 rounded-full"
            src={friend?.image}
            width={1000}
            height={1000}
            alt=""
          />
          <h1 className="ml-2 text-blue font-semibold" >{friend?.name}</h1>
        </div>
        <button className="bg-blue text-white   px-3 mx-3 rounded-md" onClick={()=> addFriend.mutate(channel.id)}>add</button>
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