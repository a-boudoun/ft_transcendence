"use client";
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { userDto } from '@/dto/userDto';
import Link from 'next/link';
import Image from 'next/image';

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const users = useQuery({
    queryKey: ['search', search],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8000/users/search/${search}`, { withCredentials: true });
      console.log(data);
      return data;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const User = ({ user }: { user: userDto }) => {
    return (
      <div className="flex items-center gap-4 bg-dark-gray px-4 py-2 rounded-xl">
        <Image className="sm:w-[48px] sm:h-[48px] rounded-full self-center" src={user.image} width={36} height={36} alt="user image" />
        <h3 className="text-[12px] sm:text-[24px]">{user.name}</h3>
      </div>
    )
  }

  return (
    <div className='md:block relative'>
      <input className="h-8 w-64 text-sm rounded-xl text-black focus:outline-0 focus:border-[2px] hover:opacity-60" type="text" placeholder="Search" name="search"
        onFocus={() => setIsFocused(true)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
      { users.isloading && <p>loading...</p>}
      {
        isFocused && (search.length != 0) &&  <div className='absolute top-[44px] w-64 max-h-56 bg-light-gray rbg-light-gray p-4 flex flex-col gap-1 overflow-y-scroll rounded-2xl'>
                  {
                    users.data?.users?.length === 0 ? <p className="text-center">No user found</p> :
                    users.data?.users?.map((user: userDto) => (
                      <Link  href={`/profile/${user.name}`}>
                        <User user={user} />
                      </Link>
                    ))
                  }
                </div>
      }
      </div>
  )
}

export default SearchBar;