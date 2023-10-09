"use Client";

import React from "react";
import { userDto } from "@/dto/userDto";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Unlock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Client } from "@/providers/QueryProvider";

const BlockedUser = ({ user }: { user: any }) => {
  const unblock = useMutation({
    mutationKey: ["unblock"],
    mutationFn: async (id: number) => {
      await axios.delete(`/users/unblock/${id}`);
    },
    onSuccess: () => {
      Client.refetchQueries(["blockList"]);
    },
  });

  return (
    <div
      className={`flex justify-between px-4 py-2 mx-2 rounded-xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg`}
    >
      <div className="grow flex items-center gap-4">
        <Image
          className="w-[48px] h-[48px] rounded-full self-center"
          src={user.image}
          width={1000}
          height={1000}
          alt="user image"
        />
        <h3>{user.username}</h3>
      </div>
      <button onClick={() => unblock.mutate(user.id)}>
        <Unlock color="#7ac7c4" size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

const BlockList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["blockList"],
    queryFn: async () => {
      const { data } = await axios.get("/users/blockedUsers");
      return data;
    },
  });

  if (isLoading) return <div className="">loading... </div>;
  else {
    return (
      <div className="flex flex-col gap-4">
        <div
          className={
            "h-full flex flex-col gap-1 overflow-auto scrollbar rounded-2xl"
          }
        >
          {data.map((user: userDto) => {
            return <BlockedUser key={user.id} user={user} />;
          })}
        </div>
      </div>
    );
  }
};

export default BlockList;
