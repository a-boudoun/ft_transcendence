"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';
import { useState, useEffect, useRef, use } from 'react';
import Modal from '@/components/chat/Modal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisMid, setisopen, setmodaltype } from '@/redux/features/currentChannel';
import { useMutation } from '@tanstack/react-query';
import userDto from '@/dto/userDto';
import { Client } from '@/providers/QueryProvider';



const Right = () => {

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.currentChannel.channel);
  const isMid = useSelector((state: any) => state.currentChannel.isMid);
  const user = useSelector((state: any) => state.currentChannel.user);
  const [input, setInput] = useState('');
  const [userType, setUserType] = useState('');
  const [me, setMe] = useState<any>({});






  const handleChange = (e: any) => {
    setInput(e.target.value);
  }
  const isMember = data.memberships?.some((membership :any) => membership?.member?.id === user.id)
  useEffect(() => {
    if(!data.memberships) return;
    const member = data.memberships?.find((item: any) => item.member?.id === user.id);
    if(!member) return;
    setMe(member);
  }, [data]);


  const handelClick = (type: string) => {
    dispatch(setmodaltype(type));
    dispatch(setisopen(true));
  }
  
  return (
    <div className={`${isMid === false ? 'w-full sm:w-1/2 md:w-7/12 lg:w-3/12 ' : 'hidden lg:w-3/12 lg:flex lg:flex-col'}  bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg rounded-xl`}>
      <button onClick={() => dispatch(setisMid(true))}>
        <Image
          className="h-[28px] w-[28px]  rounded-full  m-4 lg:hidden absolute top-0 left-0 "
          src={'/img/cancel.svg'}
          width={1000}
          height={1000}
          alt=""
        />
      </button>
      <div className="h-fit w-full rounded-xl  my-3 ">

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
          <button onClick={()=> handelClick("settings")} className='rounded-full hover:bg-light-gray'>
            <Image
              className={`h-[29px] w-[56px]  rounded-full my-3 ${me.title === 'owner' ? '': 'hidden'}`}
              src={'/icons/navBar/settings.svg'}
              width={1000}
              height={1000}
              alt="" />
          </button>
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
      <div className="h-1/3 w-[96%] m-2 rounded-xl">
        <div className="text-blue flex px-4 text-xl mb-2">Members</div>
        <div>

          {data.memberships?.map((member: any) => (
            <Items key={member.id} member={member} user={me} id={data.id}/>
          ))}
        </div>
      </div>
      <div className="h-1/3 w-[96%]  m-2 bg-blue rounded-xl hidden">

      </div>
    </div>
  )
}


export default Right;


export const Items = ({ member , user, id}: { member: any, user: any, id: number}) => {
 const [isClicked, setIsClicked] = useState(false);
 
  
  return (
    <>
      <div className={ `bg-dark-gray rounded-lg py-1  m-1 px-2 flex items-center relative`}>
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
       null:  <button className={`ml-auto mr-2 `} onClick={()=> setIsClicked(!isClicked)}>
       <Image
         className="h-[30px] w-[30px]"
         src={'/img/more.svg'}
         width={1000}
         height={1000}
         alt="" />
       </button>}
          <div className={`relative ${isClicked ? '' : 'hidden'}`}>
            <More member={member} user={user} id={id}/>
          </div>
      </div>
    </>
  )

}


export const  More = ({ member , user, id}: { member: any, user: any, id: number}) => {

  return (
    <div className="absolute w-56  h-fit rounded-md  top-4 right-4 bg-gray-600 z-50">
        <Admin  member={member} user={user} id={id}/>
        <Ban    member={member} user={user} id={id}/>
        <Kick   member={member} user={user} id={id}/>
        <Mute   member={member} user={user} id={id}/>
    </div>
  )
}



export const Mute = ({ member , user, id}: { member: any, user: any, id: number}) => {
  
    return (
      <div className={`w-[90%] h-fit m-2 px-2 py-1 rounded-md z-50 hover:bg-gray-500 flex items-center cursor-pointer`}>
          <Image
            className="h-[25px] w-[25px]"
            src={'/img/mute.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h6 className='text-sm ml-4 '>Mute user</h6>
      </div>
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
        console.log(data);  
        return data;
      },
      onSuccess: () => {
       Client.refetchQueries('channels');
       Client.refetchQueries('channel');
      }
     
    });

    return (
      <button className={`${user.title !== 'owner' ? 'hidden' : ''} w-[90%] h-fit m-2 px-2 py-1 rounded-md z-50 hover:bg-gray-500 flex items-center cursor-pointer `} onClick={()=> addAdmin.mutate(member.id)}>
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
        console.log(data);  
        return data;
      },
      onSuccess: () => {
       Client.refetchQueries('channels');
       Client.refetchQueries('channel');
      }
     
    });
    return (
      <button className="w-[90%] h-fit m-2 px-2 py-1 rounded-md z-50 hover:bg-gray-500 flex items-center cursor-pointer" onClick={ () => kick.mutate(member.id) }> 
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
  
    return (
      <div className="w-[90%] h-fit m-2 px-2 py-1 rounded-md z-50 hover:bg-gray-500 flex items-center cursor-pointer">
          <Image
            className="h-[25px] w-[25px]"
            src={'/img/ban.svg'}
            width={1000}
            height={1000}
            alt="" />

            <h6 className='text-sm ml-4 '>Ban user </h6>
      </div>
    )
}




