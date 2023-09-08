"use client"

import React from 'react'
import User from '@/components/profile/User'
import UserDetails from '@/components/profile/UserDetails'
import Achievements from '@/components/profile/Achievements'
import Matches from '@/components/profile/Matches'
import ProfileFriends from '@/components/profile/ProfileFriends'
import MidButtom from '@/components/profile/MidBottom'
import { useQuery } from '@tanstack/react-query'
import axios from '@/apis/axios'
import { useRouter } from 'next/navigation'

export const ProfileComponent = ({id = null} : {id ?: string | null }) => {

  const router = useRouter();

  if (id){
    const isExist = useQuery({
      queryKey: ['isExist'],
      queryFn: async () => {
        const {data} = await axios.get(`/users/isNameExist/${id}`);
        return data;
      }
    });

    const isBlocked = useQuery({
      queryKey: ['isBlocked'],
      queryFn: async () => {
        const {data} = await axios.get(`/users/isBlocked/${id}`);
        return data;
      }
    });

    if (isExist.isLoading || isBlocked.isLoading)
      return <div>Loading...</div>;
    if (isExist.data === false || isBlocked.data === true)
      router.push('/profile');
  }

  return (
    <main className="h-full w-full pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
      <div className='hidden xl:flex w-[380px] min-w-[320px] flex-col gap-8  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
        <Achievements/>
        <Matches id={id}/>
      </div>
      <div className='h-full max-w-[660px] grow flex flex-col sm:gap-4 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:p-4 sm:rounded-[2.5rem] sm:shadow-2xl'>
        <User id={id}/>
        <UserDetails Stats={<MidButtom />} Archievement={<Achievements />} Matches={<Matches id={id}/>} Friends={<ProfileFriends id={id}/>}/>
      </div>
      <div className='hidden lg:flex w-[380px] min-w-[320px] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
        <ProfileFriends id={id} />
      </div>
    </main>
  )
}

export default ProfileComponent;