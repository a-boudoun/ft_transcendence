import React from 'react'
import User from '@/components/profile/User'
import UserDetails from '@/components/profile/UserDetails'
import Achievements from '@/components/profile/Achievements'
import Matches from '@/components/profile/Matches'
import ProfileFriends from '@/components/profile/ProfileFriends'
import MidButtom from '@/components/profile/MidBottom'

export const ProfileComponent = ({id = null} : {id ?: string | null }) => {
  return (
    <main className="h-full w-full bg-dark-gray  pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
    <div className='hidden xl:flex w-[340px] flex-col gap-8  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
      <Achievements id={id}/>
      <Matches id={id}/>
    </div>
    <div className='h-full max-w-[640px] grow flex flex-col sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:p-4 sm:rounded-[2.5rem] sm:shadow-2xl'>
      <User id={id}/>
      <UserDetails Stats={<MidButtom id={id}/>} Archievement={<Achievements id={id}/>} Matches={<Matches id={id}/>} Friends={<ProfileFriends id={id}/>}/>
    </div>
    <div className='hidden lg:flex w-[340px]  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
      <ProfileFriends id={id} />
    </div>
  </main>
  )
}

export default ProfileComponent;
