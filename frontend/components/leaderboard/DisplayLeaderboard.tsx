"use client"

import React from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import userDto from '@/dto/userDto';

const UserStats = ({user} : {user : userDto}) => {
    const totalGames = user.wins + user.loses;

    return (
      <div className="flex items-center gap-2 ml-auto sm:gap-8">
        <div>
          <span className='sm:text-lg'>{totalGames}</span>
          <h1 className="sm:text-lg font-bold text-blue ">T.games</h1>
        </div>
        <div>
          <span className='sm:text-lg'>{user.wins}</span>
          <h1 className="sm:text-lg font-bold text-blue ">wins</h1>
        </div>
        <div>
          <span className='sm:text-lg'>{user.loses}</span>
          <h1 className="sm:text-lg font-bold text-blue ">loses</h1>
        </div>
      </div>
    )
}

const Me = ({user, rank} : {user : userDto, rank : number}) => {
    return (
      <div className="flex flex-wrap sm:items-center gap-4 bg-dark-gray p-4 rounded-3xl sm:p-8 sm:shadow-2xl sm:gap-8">
          <Image className="rounded-full sm:w-[128px] " src={user.image} width={64} height={64} alt={'user image'}  />
          <div className='text-left'>
            <h1 className="text-3xl font-bold ">{user.name}</h1>
            <span className='text-2xl'> {`#${rank}`}</span>
            <span className='text-blue text-xl'> lvl </span>
            <span className='text-xl'>{user.level}</span>
          </div>
        <UserStats user={user} />
      </div>
    )
}

const User = ({user, rank}: {user : userDto, rank: number}) => {

  return (
    <div className="flex flex-wrap  items-center gap-4 p-4 border-b -dark-gray sm:gap-8 ">
      <span className='text-xl sm:text-3xl font-bold'> {`${rank}`}</span>
      <Image className="rounded-full sm:w-[64px]" src={user.image} width={54} height={54} alt={'user image'}  />
      <div className='text-left'>
          <h1 className="text-lg sm:text-2xl font-bold ">{user.name}</h1>
          <span className='text-blue text-lg'> lvl </span>
          <span className='text-lg'>{user.level}</span>
      </div>
      <UserStats user={user} />
    </div>
  )
}

const DisplayLeaderboard = () => {
  let rank = 1;

  const {data, isLoading} = useQuery({
    queryKey: ['Users'],
    queryFn: async () => {
      const {data} = await axios.get('http://localhost:8000/users', {withCredentials: true});
      return data;
    }
  });

  const currentUser = useQuery({
    queryKey: ['Me'],
    queryFn: async () => {
      const {data} = await axios.get('http://localhost:8000/users/me', {withCredentials: true});
      return data;
    }
  });

  if (isLoading || currentUser.isLoading) {
    return <div>Loading...</div>
  }

  data.users?.map((user: userDto, index: number) =>{
      if (currentUser.data.name === user.name)
        rank = index + 1;
  })

  return (
    <div className='h-full max-w-[860px] grow flex flex-col gap-2 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-4 sm:rounded-[2.5rem] sm:shadow-2xl'>
      <Me user={currentUser.data} rank={rank}/>
      <div className='bg-light-gray grow p-4 rounded-3xl'>
        {
          data.users?.map((user: userDto, index: number) => {

            return <User user={user} rank={index + 1} />
          })
        }
      </div>
    </div>
  )
}

export default DisplayLeaderboard;