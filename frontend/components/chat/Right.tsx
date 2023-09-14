"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';
import { useState, useEffect, useRef, use } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setid, setisMid, setisopen, setmodaltype } from '@/redux/features/globalState';
import { useMutation } from '@tanstack/react-query';
import { Client } from '@/providers/QueryProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCloseOutSide from '@/hookes/useCloseOutSide';
import { channel } from 'diagnostics_channel';

const Right = () => {

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.globalState.channel);
  const isMid = useSelector((state: any) => state.globalState.isMid);
  const user = useSelector((state: any) => state.globalState.user);
  const bannations = useSelector((state: any) => state.globalState.channel.bannations);
 
  const [input, setInput] = useState('');
  const [userType, setUserType] = useState('');
  const [me, setMe] = useState<any>({});

  const handleChange = (e: any) => {
    setInput(e.target.value);
  }
 
  const isMember = data.memberships?.some((membership :any) => membership?.member?.id === user.id)
  useEffect(() => {
   
    if(!data.memberships)
      return;
    const member = data.memberships?.find((item: any) => item.member?.id === user.id);
    if(!member)
      return;
    setMe(member);
  }, [data.memberships]);


  const handelClick = (type: string) => {
    dispatch(setmodaltype(type));
    dispatch(setisopen(true));
   
  }

  
  return (
    <div className={`${isMid === false ? 'w-full md:w-1/2  lg:w-4/12 ' : 'hidden lg:w-5/12 lg:flex lg:flex-col max-w-xs'} h-full sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:rounded-[2.5rem] sm:p-4 `}>
        <div className='bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg h-full sm:rounded-[2rem] relative'>

      <button className='absolute top-4 left-4  hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg w-[36px] h-[36px] rounded-full flex justify-center items-center lg:hidden ' onClick={() => dispatch(setisMid(true))} >
        <Image
          className="h-[24px] w-[24px]  rounded-full    "
          src={'/img/cancel.svg'}
          width={1000}
          height={1000}
          alt=""
          />
      </button>
      <div className="h-fit w-full rounded-xl  py-3 ">

        <Image
          className="h-[150px] w-[150px]  rounded-full mx-auto my-3 "
          src={data.image}
          width={1000}
          height={1000}
          alt="" />

        <h1 className='text-center text-white text-xl t'>{data.name}</h1>
        <div className={`mt-5 flex flex-row justify-center space-x-5 px-3 ${isMember ? '': 'hidden'}`}>

          <button onClick={()=> handelClick("addFriend")}>
            <Image
              className="h-[29px] w-[56px]  rounded-full  my-3 hover:opacity-60"
              src={'/img/add.svg'}
              width={1000}
              height={1000}
              alt="" />
          </button>
          {
            me.title === 'owner' || me.title === 'admin' ?
            <button onClick={()=> handelClick("settings")} className='rounded-full '>
            <Image
              className={`h-[29px] w-[56px]  rounded-full my-3 hover:opacity-60`}
              src={'/icons/navBar/settings.svg'}
              width={1000}
              height={1000}
              alt="" /> 
          </button>: null
            }
          <button onClick={()=> handelClick("leaveChannel")}>
          <Image
            className={`h-[29px] w-[56px] rounded-full  my-3 hover:opacity-60 }`}
            src={'/img/leave.svg'}
            width={1000}
            height={1000}
            alt="" />
          </button>
        </div>
      </div>
      <div className="h-fit w-full p-3 my-1   rounded-xl ">
        <div className="text-blue flex px-2 text-xl my-3 ">Members</div>
        <div className='w-full'>

          {data.memberships?.map((member: any) => (
            <Items key={member.id} member={member} user={me} id={data.id}/>
            ))}
        </div>
      </div>
      <div className="h-fit w-full p-3 my-1   rounded-xl ">
        <div className="text-blue flex px-2 text-xl my-3  ">Blocked </div>
        <div className='w-full '>
        {
        
        bannations?.length === 0 ? <div className='flex px-3 text-red text-sm'>No blocked users</div> : 
        bannations?.map((member: any) => (
       
            <BlockedItems key={member.id} member={member} user={me} id={data.id}/>
            
            ))}
        </div>
      </div>
      </div>
    </div>
  )
}



export default Right;


export const BlockedItems = ({ member , user, id}: { member: any, user: any, id: number}) => {
  

  const unblock = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`http://localhost:8000/channels/unban/${member.id}`,  { withCredentials: true }) 
      return data;
    },
    onSuccess: () => {
     Client.refetchQueries('channels');
     Client.refetchQueries('channel');
    }
   
  });
  return (
    <div className={ `bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-lg my-3 py-2.5 px-2   flex items-center justify-between`}>
      <div className='flex items-center'>
          <Image
              className="h-[30px] w-[30px]  rounded-full"
              src={member.member?.image}
              width={1000}
              height={1000}
              alt="" />
            <div className='mx-4'>{member.member?.name}</div>
        </div>
        {user.title === "owner" || user.title === "admin"? <button className='bg-red px-1.5 rounded-md' onClick={()=> unblock.mutate()}>
          unblock
        </button>
        : null
      }
    </div>
  )
}


export const Items = ({ member , user, id}: { member: any, user: any, id: number}) => {
 const [isOpen, setIsOpen] = useState(false);
 
  
  return (
    <>
      <div className={ `bg-white  ackdrop-blur-lg  bg-opacity-20   rounded-lg my-3 py-1 px-2   flex items-center relative`}>
        <Image

          className="h-[30px] w-[30px]  rounded-full"
          src={member.member?.image}
          width={1000}
          height={1000}
          alt="" />
        <div className="pl-3">
          <div className="  " >{member.member?.name}</div>
          <div className=" text-xs text-red" >{member.title}</div>
        </div>
        {member.title === 'owner' || user.title === 'member' || user.member === undefined || member.member.username === user.member?.username ?
       null:  <button className={`ml-auto mr-2 `} onClick={()=> setIsOpen(!isOpen)}>
       <Image
         className="h-[30px] w-[30px]"
         src={'/img/more.svg'}
         width={1000}
         height={1000}
         alt="" />
       </button>}
          <div className={`relative ${isOpen ? '' : 'hidden'}`}>
            { isOpen && <More member={member} user={user} id={id} setIsOpen={setIsOpen}/> }
          </div>
      </div>
    </>
  )

}



export const  More = ({ member , user, id, setIsOpen}: { member: any, user: any, id: number, setIsOpen: (isOpen: boolean) => void;}) => {
  const {divref} = useCloseOutSide({setIsOpen});

  return (
    <div ref={divref}
    className="absolute w-56  h-fit rounded-md  top-4 right-4 bg-bg bg-cover bg-no-repeat z-40 ">
        <Admin  member={member} user={user} id={id}/>
        <Ban    member={member} user={user} id={id}/>
        <Kick   member={member} user={user} id={id}/>
        <Mute   member={member} user={user} id={id}/>
    </div>
  )
}



export const Mute = ({ member , user, id}: { member: any, user: any, id: number}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handelClick = (type: string) => {
    dispatch(setmodaltype("mute"));
    dispatch(setid(member.member?.id));
    dispatch(setisopen(true));
   
  }
  
    return (
      <button className={`w-[90%] h-fit m-2 px-2 py-1 rounded-md z-40 hover:bg-gray-500 flex items-center cursor-pointer`} onClick={handelClick}>
          <Image
            className="h-[25px] w-[25px]"
            src={'/img/mute.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h1 className='text-sm ml-4 ' >Mute user</h1>
      </button>
    )
}

export enum MemberTitle {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner'
}

export const Admin = ({ member , user, id}: { member: any, user: any, id: number}) => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if(member.title === 'member') setMsg('Make channel admin');
    if(member.title === 'admin') setMsg('Dismiss as admin');
  }, [member]);
  const addAdmin = useMutation({
      mutationFn: async (memberid: number) => {
        const { data } = await axios.patch(`http://localhost:8000/channels/${id}/updateMembershipTitle/${memberid}`,  { withCredentials: true })
  
        return data;
      },
      onSuccess: () => {
       Client.refetchQueries('channels');
       Client.refetchQueries('channel');
      }
     
    });

    return (
      <button className={`${user.title !== 'owner' ? 'hidden' : ''} w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer `} onClick={()=> addAdmin.mutate(member.id)}>
          <Image
            className="h-[28px] w-[28px]"
            src={'/img/admin.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h6 className='text-sm ml-3 '>{msg}</h6>
      </button>
    )
}
export const Kick = ({ member , user, id}: { member: any, user: any, id: number}) => {


    const kick = useMutation({
      mutationFn: async (memberid: number) => {
        const { data } = await axios.delete(`http://localhost:8000/channels/${id}/${memberid}`,  { withCredentials: true }) 
        return data;
      },
      onSuccess: () => {
       Client.refetchQueries('channels');
       Client.refetchQueries('channel');
      }
     
    });
    return (
      <button className="w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer" onClick={ () => kick.mutate(member.id) }> 
          <Image
            className="h-[25px] w-[25px]"
            src={'/img/kick.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h6 className='text-sm ml-4 '>kick user</h6>
      </button>
    )
}
export const Ban = ({ member , user, id}: { member: any, user: any, id: number}) => {
    const ban = useMutation({
      mutationFn: async (username: string) => {
        const { data } = await axios.patch(`http://localhost:8000/channels/${id}/ban/${username}`,  { withCredentials: true })  
        return data;
      },
      onSuccess: () => {
       Client.refetchQueries('channels');
       Client.refetchQueries('channel');
      }
     
    });

    const handelClick = () => {
      ban.mutate(member.member?.username);
    }
    return (
      <button className="w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer" onClick={handelClick}>
          <Image
            className="h-[25px] w-[25px]"
            src={'/img/ban.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h1 className='text-sm ml-4 ' >Ban user </h1>
      </button>
    )
}




