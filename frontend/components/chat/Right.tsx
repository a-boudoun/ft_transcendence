"use client";

import Image from "next/image";
import axios from "@/apis/axios";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setid,
  setisMid,
  setisopen,
  setmodaltype,
} from "@/redux/features/globalState";
import { useMutation } from "@tanstack/react-query";
import { Client } from "@/providers/QueryProvider";
import "react-toastify/dist/ReactToastify.css";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import {
  Settings,
  UserPlus2,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
  UserX2,
  Ban,
  VolumeX,
  XCircle,
} from "lucide-react";

const Right = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.globalState.channel);
  const isMid = useSelector((state: any) => state.globalState.isMid);
  const user = useSelector((state: any) => state.globalState.user);
  const bannations = useSelector(
    (state: any) => state.globalState.channel.bannations
  );

  const [input, setInput] = useState("");
  const [me, setMe] = useState<any>({});

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const isMember = data.memberships?.some(
    (membership: any) => membership?.member?.id === user.id
  );
  useEffect(() => {
    if (!data.memberships) return;
    const member = data.memberships?.find(
      (item: any) => item.member?.id === user.id
    );
    if (!member) return;
    setMe(member);
  }, [data.memberships]);

  const handelClick = (type: string) => {
    dispatch(setmodaltype(type));
    dispatch(setisopen(true));
  };

  return (
    <div
      className={` ${
        isMid === false
          ? "w-full md:w-1/2  lg:w-4/12 "
          : "hidden lg:w-5/12 lg:flex lg:flex-col max-w-xs"
      } h-full sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:rounded-[2.5rem] sm:p-4 min-w-[300px]`}
    >
      <div className="overflow-auto scrollbar bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg h-full sm:rounded-[2rem] relative">
        <button
          className="absolute top-4 left-4  hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg w-[36px] h-[36px] rounded-full flex justify-center items-center lg:hidden "
          onClick={() => dispatch(setisMid(true))}
        >
          <XCircle size={28} color="#EA5581" strokeWidth={1.5} />
        </button>
        <div className="h-fit w-full rounded-xl  py-3 ">
          <Image
            className="h-[150px] w-[150px]  rounded-full mx-auto my-3 "
            src={data.image}
            width={1000}
            height={1000}
            alt=""
          />

          <h1 className="text-center text-white text-xl t">{data.name}</h1>
          <div
            className={`mt-5 flex flex-row justify-center space-x-5 px-3 ${
              isMember ? "" : "hidden"
            }`}
          >
            <button onClick={() => handelClick("addFriend")}>
              <UserPlus2 size={38} color="#7ac7c4" strokeWidth={1.5} />
            </button>
            {me.title === "owner" || me.title === "admin" ? (
              <button
                onClick={() => handelClick("settings")}
                className="rounded-full "
              >
                <Settings size={32} color="#7ac7c4" strokeWidth={1.5} />
              </button>
            ) : null}
            <button onClick={() => handelClick("leaveChannel")}>
              <LogOut size={28} color="#EA5581" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="h-fit w-full p-3 my-1   rounded-xl ">
          <div className="text-blue flex px-2 text-xl my-3 ">Members</div>
          <div className="w-full">
            {data.memberships?.map((member: any) => (
              <Items key={member.id} member={member} user={me} id={data.id} />
            ))}
          </div>
        </div>
        <div className="h-fit w-full p-3 my-1   rounded-xl ">
          <div className="text-blue flex px-2 text-xl my-3  ">Blocked </div>
          <div className="w-full ">
            {bannations?.length === 0 ? (
              <div className="flex px-3 text-red text-sm">No blocked users</div>
            ) : (
              bannations?.map((member: any) => (
                <BlockedItems
                  key={member.id}
                  member={member}
                  user={me}
                  id={data.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Right;

export const BlockedItems = ({
  member,
  user,
  id,
}: {
  member: any;
  user: any;
  id: number;
}) => {
  const unblock = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/channels/unban/${member.id}`);
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["channels"]);
      Client.refetchQueries(["channel"]);
    },
  });
  return (
    <div
      className={`bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-lg my-3 py-2.5 px-2   flex items-center justify-between`}
    >
      <div className="flex items-center">
        <Image
          className="h-[30px] w-[30px]  rounded-full"
          src={member.member?.image}
          width={1000}
          height={1000}
          alt=""
        />
        <div className="mx-4">{member.member?.username}</div>
      </div>
      {user.title === "owner" || user.title === "admin" ? (
        <button
          className="bg-red px-1.5 rounded-md"
          onClick={() => unblock.mutate()}
        >
          unblock
        </button>
      ) : null}
    </div>
  );
};

export const Items = ({
  member,
  user,
  id,
}: {
  member: any;
  user: any;
  id: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`bg-white  ackdrop-blur-lg  bg-opacity-20   rounded-lg my-3 py-1 px-2   flex items-center relative`}
      >
        <Image
          className="h-[30px] w-[30px]  rounded-full"
          src={member.member?.image}
          width={1000}
          height={1000}
          alt=""
        />
        <div className="pl-3">
          <div className="  ">{member.member?.username}</div>
          <div className=" text-xs text-red">{member.title}</div>
        </div>
        {member.title === "owner" ||
        user.title === "member" ||
        user.member === undefined ||
        member.member.username === user.member?.username ? null : (
          <button
            className={`ml-auto mr-2 `}
            onClick={() => setIsOpen(!isOpen)}
          >
            <MoreHorizontal color="#7AC7C4" strokeWidth={4} />
          </button>
        )}
        <div className="relative">
          {isOpen && (
            <More member={member} user={user} id={id} setIsOpen={setIsOpen} />
          )}
        </div>
      </div>
    </>
  );
};

const More = ({
  member,
  user,
  id,
  setIsOpen,
}: {
  member: any;
  user: any;
  id: number;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { divref } = useCloseOutSide({ setIsOpen });

  return (
    <div
      ref={divref}
      className="absolute w-56  h-fit rounded-md  top-4 right-4 bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg  z-40 "
    >
      <Admin member={member} user={user} id={id} />
      <BanUser member={member} user={user} id={id} />
      <Kick member={member} user={user} id={id} />
      <Mute member={member} user={user} id={id} />
    </div>
  );
};

const Mute = ({ member, user, id }: { member: any; user: any; id: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const handelClick = () => {
    dispatch(setmodaltype("mute"));
    dispatch(setid(member.member?.id));
    dispatch(setisopen(true));
  };

  return (
    <button
      className={`w-[90%] h-fit m-2 px-2 py-1 rounded-md z-40 hover:bg-gray-500 flex items-center cursor-pointer`}
      onClick={handelClick}
    >
      <VolumeX size={28} color="#7ac7c4" strokeWidth={1.5} />

      <h1 className="text-sm ml-4 ">Mute user</h1>
    </button>
  );
};

export enum MemberTitle {
  MEMBER = "member",
  ADMIN = "admin",
  OWNER = "owner",
}

export const Admin = ({
  member,
  user,
  id,
}: {
  member: any;
  user: any;
  id: number;
}) => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (member.title === "member") setMsg("Make channel admin");
    if (member.title === "admin") setMsg("Dismiss as admin");
  }, [member]);
  const addAdmin = useMutation({
    mutationFn: async (memberid: number) => {
      const { data } = await axios.patch(
        `/channels/${id}/updateMembershipTitle/${memberid}`
      );
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["channels"]);
      Client.refetchQueries(["channel"]);
    },
  });

  return (
    <button
      className={`${
        user.title !== "owner" ? "hidden" : ""
      } w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer `}
      onClick={() => addAdmin.mutate(member.id)}
    >
      <ShieldCheck size={28} color="#7ac7c4" strokeWidth={1.5} />
      <h6 className="text-sm ml-3 ">{msg}</h6>
    </button>
  );
};

const Kick = ({ member, user, id }: { member: any; user: any; id: number }) => {
  const kick = useMutation({
    mutationFn: async (memberid: number) => {
      const { data } = await axios.delete(`/channels/${id}/${memberid}`);
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["channels"]);
      Client.refetchQueries(["channel"]);
    },
  });
  return (
    <button
      className="w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer"
      onClick={() => kick.mutate(member.id)}
    >
      <UserX2 size={28} color="#7ac7c4" strokeWidth={1.5} />

      <h6 className="text-sm ml-4 ">kick user</h6>
    </button>
  );
};

const BanUser = ({
  member,
  user,
  id,
}: {
  member: any;
  user: any;
  id: number;
}) => {
  const ban = useMutation({
    mutationFn: async (username: string) => {
      const { data } = await axios.patch(`/channels/${id}/ban/${username}`);
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["channels"]);
      Client.refetchQueries(["channel"]);
    },
  });

  const handelClick = () => {
    ban.mutate(member.member?.username);
  };
  return (
    <button
      className="w-[90%] h-fit m-2 px-2 py-1 rounded-md  hover:bg-gray-500 flex items-center cursor-pointer"
      onClick={handelClick}
    >
      <Ban size={24} color="#7ac7c4" strokeWidth={1.5} />
      <h1 className="text-sm ml-4 ">Ban user </h1>
    </button>
  );
};
