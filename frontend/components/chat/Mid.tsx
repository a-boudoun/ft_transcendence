"use client";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { userDto } from "@/dto/userDto";
import { useSelector } from "react-redux";
import {
  setMembership,
  setMessage,
  setisMid,
  setisChild,
  setisopen,
  setmodaltype,
} from "@/redux/features/globalState";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import Message from "@/dto/Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { socket } from "./chatSocket";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeftCircle, Info } from "lucide-react";
import { Client } from "@/providers/QueryProvider";

function Mid() {
  const dispatch = useDispatch<AppDispatch>();

  const channel = useSelector((state: any) => state.globalState.channel);
  const user = useSelector((state: any) => state.globalState.user);
  const isMid = useSelector((state: any) => state.globalState.isMid);
  const [blocked, setBlocked] = useState<number[]>([])
  const messages = useSelector(
    (state: any) => state.globalState.channel.messages
  );
  const [input, setInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const showToast = () => {
    toast.error("you are muted", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();
    dispatch(setisChild(true));
  }, []);

  // const messageContainerRef = useRef(null);

  const joinChannel = useMutation({
    mutationFn: async (user: userDto) => {
      const { data } = await axios.patch(
        `/channels/${channel.id}/joinChannel`,
        user
      );
      dispatch(setMembership(data));
    },
  });

  const isMuted1 = useMutation({
    mutationFn: async (user: userDto) => {
      const { data } = await axios.get(
        `/channels/isMuted/${channel.id}/${user.username}`
      );
      return data;
    },
    onSuccess: (data: any) => {
      setIsMuted(data);
    },
  });

  useEffect(() => {
    if (!user || !channel || channel?.type === "Direct") return;
    isMuted1.mutate(user);
  }, [user]);

  const handelSubmit = (event: any) => {
    event.preventDefault();
    if (!input.trim()) return;
    isMuted1.mutate(user);
    if (isMuted) {
      showToast();
      return;
    }
    socket.emit("prevmessage", {
      channel: channel.id,
      message: input,
      from: user.username,
    });
    setInput("");
  };
  const block = useQuery({
    queryKey: ["blockedandblocker", user.id],
    queryFn: async () => {
      if (!user.id) return;
      const { data } = await axios.get(`/channels/blockedandblocker/${user.id}`);
      return data;
    },
    onSuccess: (data: any) => {
      setBlocked(data);
    },
  });
  useEffect( () => {
   
    const onMsg = async (msg: any) => {
      function ss(member: any) {
        return member.member.username === msg.from;
      }
      const member = channel.memberships?.find(ss);
      const createdAt = moment().format("yyyy-MM-DDTHH:mm:ssZ");
      Client.refetchQueries(["blockedandblocker", user.id]);
      if(!blocked.includes(member?.member.id))
      {
        dispatch(
          setMessage({
            content: msg.content,
            sender: member?.member,
            date: createdAt,
          })
          );
      }
    };
    socket.on(`message/${channel.id}`, onMsg);
    return () => {
      socket.off(`message/${channel.id}`, onMsg);
    };
  }, [channel]);

  // useEffect(() => {
  //     if (messageContainerRef.current) {
  //         messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  //     }
  // }, [messages]);

  const handleJoinChannel = () => {
    dispatch(setisopen(true));
    dispatch(setmodaltype("joinchannel"));
  };
  const isMember = channel.memberships?.some(
    (membership: any) => membership?.member?.id === user.id
  );
  {
    if (channel.memberships && user.id)
      return (
        <>
          <ToastContainer />
          <div
            className={` text-white  rounded-[2.5rem] sm:mr-6 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg  sm:drop-shadow-lg sm:p-4 ${
              isMid === true
                ? "w-full md:w-1/2 lg:w-7/12 flex flex-col xl:w-5/12"
                : "hidden lg:flex lg:flex-col  lg:w-5/12"
            } `}
          >
            <div className="flex flex-col justify-between h-full sm:rounded-[2rem] overflow-hidden bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg">
              <div className="h-fit  flex items-center py-3   justify-between px-3 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg">
                <div className="flex items-center space-x-2 ">
                
                  <Link href={`/channel`} className="md:hidden">
                    <ArrowLeftCircle
                      size={24}
                      color="#7ac7c4"
                      strokeWidth={1.5}
                    />
                  </Link>
                  <Image
                    className="h-10 w-10 rounded-full  "
                    src={channel.image}
                    width={100}
                    height={100}
                    alt=""
                  />
                  <span className="text-center h-fit">{channel.name}</span>
                </div>
                <div className="text-3xl mr-5 flex items-center justify-center lg:hidden ">
                  <button onClick={() => dispatch(setisMid(false))}>
                    <Info size={24} color="#7ac7c4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="overflow-auto scrollbar flex-grow py-3 px-2">
                {" "}
                {/* ref={messageContainerRef} */}
                {messages?.map((msg: Message, id: number) => (
                  <Message
                    key={id}
                    msg={msg.content}
                    id={msg.sender}
                    user={user}
                    date={msg.date}
                  />
                ))}
              </div>
              <div className="h-[56px] flex justify-between  items-center px-3 py-2  rounded-lg bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg">
                <form
                  onSubmit={handelSubmit}
                  className={` ${
                    isMember === true ? "" : "hidden"
                  } flex justify-between items-center w-full`}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e: any) => setInput(e.target.value)}
                    className="bg-transparent w-full h-10 rounded-md px-2 outline-none"
                    placeholder="Send Message.."
                  />
                  <button type="submit" className="  px-3 rounded-md">
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
                <button
                  className={` ${
                    isMember === false ? "" : "hidden"
                  } flex  justify-center items-center  w-full h-full text-blue`}
                  onClick={handleJoinChannel}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </>
      );
  }
}

export default Mid;

export const Message = (msg: any) => {
  const [style, setStyle] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    setStyle(
      `${
        msg.id?.username === msg.user?.username
          ? "justify-end"
          : "justify-start"
      }`
    );
    setDate(moment.duration(moment().diff(msg.date)).humanize());
  }, [msg]);
  if(!msg.id) return(<></>)
  return (
    <div className={`w-full flex flex-col `}>
      <div className={` w-full flex ${style} text-[10px] px-3  text-blue`}>
        {date} ago
      </div>
      <div className={`w-full flex ${style}    `}>
        <div
          className={`w-fit  max-w-[250px] bg-white bg-opacity-20 ackdrop-blur-lg ${
            msg.id?.username === msg.user?.username
              ? " rounded-tl-xl"
              : "rounded-tr-xl"
          }  rounded-b-xl py-2 m-2 min-w-[75px] `}
        >
          <div key={msg.id} className="px-5 break-words text-left text-sm ">
            {msg.msg}
          </div>
        </div>
        <div
          className={`${
            msg.id?.username === msg.user?.username ? "top-0" : "order-first"
          } m-2 `}
        >
          <Image
            className="h-[30px] w-[30px]  rounded-full"
            src={msg.id?.image}
            width={1000}
            height={1000}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
