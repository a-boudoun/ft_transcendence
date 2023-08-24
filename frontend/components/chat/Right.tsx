"use client";

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axios from 'axios';
import { useSelector } from 'react-redux';
import channelDto from '@/dto/channelDto';
import { useState, useEffect, useRef } from 'react';
import Modal from '@/components/chat/Modal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setisMid, setisopen } from '@/redux/features/currentChannel';
import { useMutation } from '@tanstack/react-query';
import userDto from '@/dto/userDto';



const Right = () => {

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.currentChannel.channel);
  const isMid = useSelector((state: any) => state.currentChannel.isMid);
  const user = useSelector((state: any) => state.currentChannel.user);
  const [input, setInput] = useState('');
  const [userType, setUserType] = useState('');

  console.log("user", userType)




  const handleChange = (e: any) => {
    setInput(e.target.value);
  }
  const isMember = data.memberships?.some((membership :any) => membership.member.id === user.id)
  useEffect(() => {
    if(!data.memberships) return;
    const member = data.memberships?.find((item: any) => item.member.id === user.id);
    if(!member) return;
    setUserType(member.title);
  }, [data]);
  const handelClick = () => {
    dispatch(setisopen(true));
  }
  { if (!data.image) return <div></div> }
  return (
    <div className={`${isMid === false ? 'w-full sm:w-1/2 md:w-7/12 lg:w-3/12 ' : 'hidden lg:w-3/12 lg:flex lg:flex-col'}  bg-white bg-opacity-20 ackdrop-blur-lg  drop-shadow-lg rounded-xl`}>
      <button onClick={() => dispatch(setisMid(true))}>
        <Image
          className="h-[28px] w-[28px]  rounded-full  m-4 lg:hidden absolute top-0 left-0 "
          src={'/img/cancel.svg'}
          width={1000}
          height={1000}
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
        <div className={`flex flex-row justify-center space-x-5 px-3 ${isMember ? '': 'hidden'}`}>

          <button onClick={handelClick}>
            <Image
              className="h-[29px] w-[56px]  rounded-full  my-3 hover:opacity-60"

              src={'/img/add.svg'}
              width={1000}
              height={1000}
              alt="" />
          </button>
          <Image
            className={`h-[29px] w-[56px]  rounded-full my-3 hover:opacity-60 ${userType === 'owner' ? '': 'hidden'}`}
            src={'/icons/navBar/settings.svg'}
            width={1000}
            height={1000}
            alt="" />
          <Image
            className={`h-[29px] w-[56px] rounded-full  my-3 hover:opacity-60 }`}
            src={'/img/leave.svg'}
            width={1000}
            height={1000}
            alt="" />
        </div>
      </div>
      <div className="h-1/3 w-[96%] m-2 rounded-xl">
        <div className="text-blue flex px-4 text-xl mb-2">Members</div>
        <div>

          {data.memberships?.map((member: any) => (
            <Items key={member.id} data={member} user={user}  channelid={data.id} userType={userType}/>
          ))}
        </div>
      </div>
      <div className="h-1/3 w-[96%]  m-2 bg-blue rounded-xl hidden">

      </div>
    </div>
  )
}


export default Right;


export const Items = ({ data , user, channelid, userType}: { data: any, user: any, channelid: number,  userType: string}) => {
  const [isclicked, setIsclicked] = useState(false);
  const [style, setStyle] = useState('');

  useEffect(() => {
    
    console.log(userType)
    console.log(data.title)
     console.log(user.name)
     
    if (userType === 'member') 
      setStyle('hidden')
    else if(user.name === data.member.name)
      setStyle('hidden')
    else if(data.title === 'owner')
      setStyle('hidden')
 
    
  }, [data, user, userType]);


 
  return (
    <>
      <div className="bg-dark-gray rounded-lg py-1 flex m-1 px-2 flex items-center relative">
        <Image

          className="h-[30px] w-[30px]  rounded-full"
          src={data.member?.image}
          width={1000}
          height={1000}
          alt="" />
        <div className="pl-3">
          <div className="  " >{data.member?.name}</div>
          <div className=" text-xs text-red" >{data.title}</div>
        </div>
        <button className={`ml-auto mr-2 ${style}`} onClick={()=> setIsclicked(!isclicked)}>

        <Image
          className="h-[30px] w-[30px]"
          src={'/img/more.svg'}
          width={1000}
          height={1000}
          alt="" />

          </button>
    
         <More iscliked={isclicked} Membershipid={data.id} />
      </div>
    </>
  )

}


export const More = ({iscliked, Membershipid, channelId, userType}:{iscliked: boolean,Membershipid: number, channelId: number, userType: string}) => {

 


  const addAdmin = useMutation({
    mutationFn: async (Membershipid: number, channelId:number) => {
        const { data } = await axios.patch(`http://localhost:8000/channels/1/memberships/${Membershipid}`, { withCredentials: true });
        console.log(data)
        return data;
    },
    onSuccess: () => {
        console.log("added")
    }
});
    const handelClick = () => {
      addAdmin.mutate(Membershipid, channelId);
    }
  return (
    <div className={`${iscliked === true ? '': 'hidden'} w-48 h-fit bg-gray-900 flex flex-col rounded-xl absolute right-2 top-10 z-50`}>

      <button className={`py-2`} onClick={handelClick}>
        <h1>add admin</h1>
      </button>
    </div>
  );
}