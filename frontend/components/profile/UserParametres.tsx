"use client";

import Link from "next/link";
import AddFriend from "@/components/profile/AddFriend";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import socket from "../socketG";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import axios from "@/apis/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import User from "./User";

interface dropProps {
  id: number;
  setIsOpen: (isOpen: boolean) => void;
}

const Challnege = ({ id }: { id: number }) => {
  return (
    <button
      className="bg-blue px-3 py-1 text-black rounded-xl"
      onClick={() => {
        socket.emit("invite-freind", id);
      }}
    >
      Challnege
    </button>
  );
};

const Block = ({ id }: { id: number }) => {
  const router = useRouter();

  const block = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.post(`/users/block`, { id: id });
      return data;
    },
    onSuccess: () => {
      router.push("/profile");
    },
  });

  const handleClick = async () => {
    await block.mutate(id);
  };

  return (
    <button
      className="bg-red px-3 py-1 text-black rounded-xl"
      onClick={handleClick}
    >
      Block
    </button>
  );
};

const Mesage = ({ id }: { id: number }) => {
  console.log("--------------", id);

  const { data, isLoading } = useQuery({
    queryKey: ["direct", id],
    queryFn: async () => {
      const { data } = await axios.get(`/channels/getChannelId/${id}`);
      // console.log("---------", data);
      return data;
    },
  });

  return isLoading ? (
    <div></div>
  ) : (
    <Link
      className="bg-blue px-3 py-1 text-black rounded-xl"
      href={`/chat/${data}`}
    >
      Mesage
    </Link>
  );
};

const Drop = ({ id, setIsOpen }: dropProps) => {
  const { divref } = useCloseOutSide({ setIsOpen });

  const Status = useQuery({
    queryKey: ["friendStatus"],
    queryFn: async () => {
      const { data } = await axios.get(`/friendship/status/${id}`);
      return data;
    },
  });

  return (
    <div
      ref={divref}
      className="w-36 absolute bottom-6 right-6 text-sm flex flex-col gap-2 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg p-2 rounded-2xl"
    >
      <AddFriend id={id} Status={Status} />
      <Mesage id={id} />
      {Status.data?.status === "accepted" && <Challnege id={id} />}
      <Block id={id} />
    </div>
  );
};

const UserParametres = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="absolute bottom-6 right-6">
      <button onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical color="white" strokeWidth={4} />
      </button>
      {isOpen && <Drop id={id} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default UserParametres;
