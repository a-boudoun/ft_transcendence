"use client";

import React from "react";
import User from "@/components/profile/User";
import UserDetails from "@/components/profile/UserDetails";
import Achievements from "@/components/profile/Achievements";
import Matches from "@/components/profile/Matches";
import ProfileFriends from "@/components/profile/ProfileFriends";
import MidButtom from "@/components/profile/MidBottom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

export const ProfileComponent = ({ username }: { username: string }) => {
  const router = useRouter();

    const user = useQuery({
      queryKey: ['user', username],
      queryFn: async ()=> {
        const {data} = await axios.get(`/users/getUser/${username}`)
        return data;
      }
    });
    if (user.isLoading)
      return <ProfileSkeleton />;
    else if (!user.data){
        router.push('/profile');
        return <div></div>;
    }
    else {
      return (
        <main className="h-full w-full pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
          <div className='hidden xl:flex w-[380px] min-w-[320px] flex-col gap-8  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
            <Achievements/>
            <Matches id={user.data.id}/>
          </div>
          <div className='h-full max-w-[660px] grow flex flex-col sm:gap-4 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:p-4 sm:rounded-[2.5rem] sm:shadow-2xl'>
            <User user={user.data} isMe={username != "me" ? false : true}   />
            <UserDetails Stats={<MidButtom user={user.data} />} Archievement={<Achievements />} Matches={<Matches id={user.data.id}/>} Friends={<ProfileFriends id={user.data.id} isMe={username != "me" ? false : true} />}/>
          </div>
          <div className='hidden lg:flex w-[380px] min-w-[320px] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 rounded-[2.5rem] shadow-2xl'>
            <ProfileFriends  id={user.data.id} isMe={username != "me" ? false : true} />
          </div>
        </main>
      )
      }
}

export default ProfileComponent;
