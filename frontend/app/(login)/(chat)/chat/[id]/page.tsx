"use client";
import { userDto } from "@/dto/userDto";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "@/apis/axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MessageDto from "@/dto/Message";
import { socket } from "@/components/chat/chatSocket";
import moment from "moment";
import { Message } from "@/components/chat/Mid";
import { Client } from "@/providers/QueryProvider";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { MoreHorizontal, Gamepad2, ArrowLeftCircle } from "lucide-react";
import ChallengeDropDown from "@/components/common/ChallengeDropDown";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import { channel } from "diagnostics_channel";

interface MoreProps {
  user: any;
  setIsOpen: (isOpen: boolean) => void;
}

const More = ({ user, setIsOpen }: MoreProps) => {
  const { divref } = useCloseOutSide({ setIsOpen });
  const [isChallenge, setIsChallenge] = useState<boolean>(false);

  const router = useRouter();
  return (
    <div
      ref={divref}
      className="absolute w-60  rounded-[1.4rem]   top-4 right-3  bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg p-3 "
    >
      <div className="bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-[1.2rem] overflow-hidden">
        <button
          className="flex items-center justify-start px-4 py-2 w-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg rounded-t-lg"
          onClick={() => router.push(`/profile/${user.username}`)}
        >
          <Image
            className="h-8 w-8 rounded-full  "
            src={user.image}
            width={100}
            height={100}
            alt="user image"
          />
          <span className="pl-6 text-base font-semibold text-blue">
            view Profile
          </span>
        </button>
        <button
          className="flex items-center justify-start px-4 py-2 w-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg rounded-b-lg"
          onClick={() => setIsChallenge(!isChallenge)}
        >
          <Gamepad2 size={32} color="#7ac7c4" strokeWidth={1.5} />
          <span className="px-6 text-base font-semibold text-blue">
            Challenge
          </span>
        </button>
      </div>
      <div className="relative text-sm top-[-46px] right-[-24px]">
        {isChallenge && (
          <ChallengeDropDown id={user.id} setIsOpen={setIsChallenge} />
        )}
      </div>
    </div>
  );
};

const page = ({ params }: { params: { id: any } }) => {
  const dispatsh = useDispatch<AppDispatch>();

  const router = useRouter();
  const user = useSelector((state: any) => state.globalState.user);
  const [otherUser, setOtherUser] = useState<userDto>();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["direct", params.id],
    queryFn: async () => {
      if(!parseInt(params.id) || params.id.length > 8)
      {
        router.push("/chat");
        return null;
      }
      const { data } = await axios.get(`/channels/directchannel/${params.id}`);

      setMessages(data.messages);
      socket.emit("join", { channel: data.id });
      if (!data || data.type !== "Direct") {
        router.push("/chat");
        return data;
      }
      return data;
    },
  });

  useEffect(() => {
    if (!data || !user || isLoading) return;
    const otherUser = data.memberships.find(
      (member: any) => member.member.username !== user.username
    );
    if (!otherUser) return;
    setOtherUser(otherUser.member);
  }, [data, user]);

  const blocked = useQuery({
    queryKey: ['blocked', otherUser?.id],
    queryFn: async () => {
      if (!otherUser) 
        return null;
      const { data } = await axios.get(`/users/isBlocked/${otherUser.id}`);
      return data;
    },
  });

  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  useEffect(() => {
    if (!data || !user || !socket || !otherUser) return;
    const onMsg = (msg: any) => {
      const member = msg.from === user.username ? user : otherUser;
      const createdAt = moment().format("yyyy-MM-DDTHH:mm:ssZ");
      const newMessage = {
        content: msg.content,
        sender: member,
        date: createdAt,
      };
      setMessages((prev) => [
        ...prev,
        { content: msg.content, sender: member, date: createdAt },
      ]);
    };
    socket.on(`message/${data.id}`, onMsg);
    return () => {
      socket.off(`message/${data.id}`, onMsg);
    };
  }, [data, socket, user, otherUser]);

  const handelSubmit = (event: any) => {
    event.preventDefault();
    if (!input.trim()) return;
    socket.emit("prevmessage", {
      channel: data.id,
      message: input,
      from: user.username,
    });
    setInput("");
  };

  const handechange = (event: any) => {
    setInput(event.target.value);
  };

  const unblock = useMutation({
    mutationKey: ["unblock", otherUser?.id],
    mutationFn: async () => {
      if (!otherUser) return;
      const { data } = await axios.delete(`/users/unblock/${otherUser?.id}`);
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(['blocked']);
      Client.refetchQueries(["channel"]);
    },
  });

  if (isLoading || !data || !user.id || !otherUser||!blocked.data)
    return (
      <div className="w-full  md:w-1/2 lg:w-8/12 h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4">
        <div className="w-full h-full bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:rounded-[2rem] flex justify-center items-center text-blue">
          Loading...
        </div>
      </div>
    );
  else if (!data || data.type !== "Direct") router.push("/chat");
  else
    return (
      <div
        className={`'w-full h-full  sm:rounded-[2.5rem] sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4 justify-between text-white   w-full md:w-1/2 lg:w-8/12 flex flex-col  `}
      >
        <div
          className={`flex flex-col justify-between bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg h-full sm:rounded-[2rem] overflow-hidden`}
        >
          <div className="h-fit bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg flex items-center py-3  rounded-xl  justify-between ">
            <div className="flex items-center space-x-2 ">
              <Link href={`/chat`} className="md:hidden">
                <ArrowLeftCircle size={32} color="#7ac7c4" strokeWidth={1.5} />
              </Link>
              {otherUser?.image && (
                <Image
                  className="h-10 w-10 rounded-full  "
                  src={otherUser?.image}
                  width={100}
                  height={100}
                  alt=""
                />
              )}
              <span className="text-center h-fit">{otherUser?.username}</span>
            </div>
            <div className="text-3xl mr-5 flex items-center justify-center relative">
              <button
                className="rounded-full hover:bg-white hover:bg-opacity-20 hover:ackdrop-blur-lg  p-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <MoreHorizontal color="#7AC7C4" strokeWidth={4} />
              </button>
              <div className="relative">
                {isOpen && <More user={otherUser} setIsOpen={setIsOpen} />}
              </div>
            </div>
          </div>
          <div className="overflow-auto scrollbar flex-grow py-3 px-2">
            {messages.map((message: MessageDto, id: number) => (
              <Message
                key={id}
                msg={message.content}
                id={message.sender}
                user={user}
                date={message.date}
              />
            ))}
          </div>
          <div className="h-[56px] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg items-center px-3 py-2  rounded-lg">
            {!blocked.data?.isBlock ? (
              <form
                className="flex  justify-between items-center w-full"
                onSubmit={handelSubmit}
              >
                <input
                  value={input}
                  className="bg-transparent w-full  h-10 rounded-md px-2 outline-none"
                  type="text"
                  placeholder="Type a message"
                  onChange={(e: any) => setInput(e.target.value)}
                />
                <button className="p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send-horizontal"
                  >
                    <path d="m3 3 3 9-3 9 19-9Z" />
                    <path d="M6 12h16" />
                  </svg>
                </button>
              </form>
            ) : blocked.data.blocker === otherUser.id ? (
              <div className="flex flex-col justify-center items-center w-full h-full ">
                {" "}
                you can't send messages right now
              </div>
            ) : (
              <button
                className="w-full h-full text-blue"
                onClick={() => unblock.mutate()}
              >
                unblock
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default page;
