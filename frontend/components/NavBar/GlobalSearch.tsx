"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { userDto } from "@/dto/userDto";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import { useDebounce } from "@uidotdev/usehooks";

const User = ({ user }: { user: userDto }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg ">
      <Image
        className="sm:w-[48px] sm:h-[48px] rounded-full self-center"
        src={user.image}
        width={36}
        height={36}
        alt="user image"
      />
      <h3 className="text-balck text-[12px] sm:text-[24px]">{user.username}</h3>
    </div>
  );
};

const SearchBarDropDown = ({ search }: { search: string }) => {
  const users = useQuery({
    queryKey: ["search", search],
    queryFn: async () => {
      if (search.length === 0) return null;
      const { data } = await axios.get(`/users/search/${search}`);
      return data;
    },
  });

  return (
    <div className="absolute top-11 w-52 sm:w-72 max-h-56  p-4 flex flex-col gap-1 rounded-2xl bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg overflow-auto scrollbar scrollbar">
      {users.data?.users?.length === 0 ? (
        <p className="text-center">No user found</p>
      ) : (
        users.data?.users?.map((user: userDto) => (
          <Link key={user.id} href={`/profile/${user.username}`}>
            <User user={user} />
          </Link>
        ))
      )}
    </div>
  );
};

const GlobalSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { divref } = useCloseOutSide({ setIsOpen });

  const handelFocus = () => {
    if (setIsOpen != undefined) {
      setIsOpen(true);
    }
  };

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const debouncedResults = useDebounce(search, 500);

  return (
    <div ref={divref} className="md:block relative">
      <div className="flex justify-end items-center relative">
        <input
          className="h-8 w-full text-sm rounded-xl text-black focus:outline-0 focus:border-[2px] hover:opacity-60"
          type="text"
          placeholder="Search"
          name="search"
          onFocus={handelFocus}
          onChange={handleChange}
        />
        <Search
          className="absolute right-2"
          size={24}
          strokeWidth={3}
          color="#7ac7c4"
        />
      </div>
      {isOpen && search.length != 0 && (
        <SearchBarDropDown search={debouncedResults} />
      )}
    </div>
  );
};

export default GlobalSearch;
