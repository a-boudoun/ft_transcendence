"use client";

import Image from "next/image";
import Link from "next/link";
import { userDto } from "@/dto/userDto";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare, Gamepad2 } from "lucide-react";
import { useState } from "react";
import ChallengeDropDown from "@/components/common/ChallengeDropDown";

const Friends = ({ id, isMe }: { id: number; isMe: boolean }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axios.get(`/friendship/getFriends/${id}`);
      return data;
    },
  });

  if (isLoading) return <div className="">loading... </div>;
  else {
    return (
      <div
        className={
          "h-full flex flex-col gap-1 rounded-2xl overflow-auto scrollbar"
        }
      >
        {data.map((friend: userDto) => {
          return <Friend key={friend.id} user={friend} isMe={isMe} />;
        })}
      </div>
    );
  }
};

export default Friends;

export const Friend = ({ user, isMe }: { user: any; isMe: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["direct", user.id],
    queryFn: async () => {
      const { data } = await axios.get(`/channels/getChannelId/${user.id}`);
      return data;
    },
  });

  return (
    <>
    <div className="relative flex justify-between px-4 py-2 mx-2 rounded-xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg">
      <Link href={`/profile/${user.username}`}>
        <div className="grow flex items-center gap-4">
          <Image
            className="w-[48px] h-[48px] rounded-full self-center"
            src={user.image}
            width={1000}
            height={1000}
            alt="user image"
            />
          <h3 className="truncate ...">{user.username}</h3>
        </div>
      </Link>
      {isMe && (
        <>
          <div className="flex items-center gap-4 z-40">
            {isLoading ? (
              <div></div>
              ) : (
                <Link href={`/chat/${data}`}>
                <MessagesSquare size={28} color="#7ac7c4" strokeWidth={1.5} />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)}>
              <Gamepad2 size={32} color="#7ac7c4" strokeWidth={1.5} />
            </button>
          </div>
        </>
      )}
    </div>
    <div className="relative">
      {isOpen && <ChallengeDropDown id={user.id} setIsOpen={setIsOpen} />}
    </div>
    </>
  );
};
