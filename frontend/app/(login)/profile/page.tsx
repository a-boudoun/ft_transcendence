import React from 'react'
import User from '@/components/profile/User'
import UserDetails from '@/components/profile/UserDetails'
import Achievements from '@/components/profile/Achievements'
import Matches from '@/components/profile/Matches'
import ProfileFriends from '@/components/profile/ProfileFriends'
import MidButtom from '@/components/profile/MidBottom'

const Profile = () => {
  return (
        <>
        <main className="h-full w-full bg-dark-gray to-60% pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
          <div className='hidden xl:flex w-[340px] flex-col gap-8  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem]'>
            <Achievements />
            <Matches />
          </div>
          <div className='h-full max-w-[640px] 2xl:max-w-[880px]  grow flex flex-col sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:p-4 sm:rounded-[2.5rem] '>
            <User />
            <UserDetails Stats={<MidButtom/>} Archievement={<Achievements/>} Matches={<Matches/>} Friends={<ProfileFriends/>}/>
          </div>
          <div className='hidden lg:flex w-[340px]  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem]'>
            <ProfileFriends />
          </div>
        </main>
        </>
  )
}

export default Profile;