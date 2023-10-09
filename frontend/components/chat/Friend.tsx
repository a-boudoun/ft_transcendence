"use client";
import { userDto } from "@/dto/userDto";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import Image from "next/image";
import Link from "next/link";

const Friends = ({ user }: { user: userDto }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["friends", user.id],
    queryFn: async () => {
      const { data } = await axios.get(`/channels/direct/${user.username}`);
      return data;
    },
  });

  if (isLoading) return <div>loading...</div>;
  else if (!data || data.length === 0)
    return <div className="text-blue pt-10">No friends</div>;
  else
    return (
      <div className="h-[90%] overflow-auto scrollbar py-2 ">
        {data.map((friend: any) => (
          <Link key={friend.id} href={`/chat/${friend.id}`}>
            <Friend key={friend.id} friend={friend.member} />
          </Link>
        ))}
      </div>
    );
};

export default Friends;

export const Friend = ({ friend }: { friend: any }) => {
  if (!friend) return null;
  return (
    <div
      className={`bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg  h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white flex justify-between`}
    >
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-5">
          {friend?.member?.image && (
            <Image
              className="w-10 h-10 rounded-full self-center"
              src={friend?.member?.image}
              alt="user"
              width={100}
              height={100}
            />
          )}
          <h1>{friend?.member?.username}</h1>
        </div>
      </div>
    </div>
  );
};
