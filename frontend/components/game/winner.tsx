'use client';

import React from "react";
import Image from "next/image";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import socket from '@/components/socketG';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface prop {
  setWon : (val: string) => void;
  setLost : (val: string) => void;
  me : string;
  other : string;
}

export default function Won({ setWon, setLost, me, other } : prop) {
  const router = useRouter();
  const [event, setEvent] = useState<string>("retry-game");
  const [senderName, setSenderName] = useState<string>(me);
  const [senderSocketId, setSenderSocketId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [retry, setRetry] = useState<string>("Retry");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    if (timeLeft === 0) {
      router.push("/game");
    }

    return () => {
      clearInterval(timer);
    };

  }, [timeLeft]);

  socket.on('refresh-page', () => {
    setWon('');
    setLost('');
  });

  socket.on("retry-game", (data: any) => {
    setSenderName(data.sender);
    setSenderSocketId(data.senderSocketId);
    setEvent("accept-retry");
    setRetry("Click to retry");
    console.log(`event: ${event}`);
  });

  const {data, isLoading} = useQuery({
		queryKey: ['user', 'me'],
		queryFn: async ()=> {
		  const {data} = await axios.get('/users/getUser/me')
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
    return (
      <div className='flex w-full h-full items-center justify-center '>
        <div className='flex flex-col gap-8 W-[600px] h-[600px] '>
          <h1 className='text-6xl font-bold text-[#4bff60f5] '>You Won</h1>
          <div className='flex w-[400px] h-[400px] border-black'>
            <Image width={1000} height={1000} alt="#" src={data.image} className="h-full w-full rounded-full"/>
          </div>
          <button className="text-white font-bold text-2xl h-[100px] bg-red rounded-[10px] hover:bg-[#FBACB3]"
          onClick={() => {socket.emit(event, {senderUsername: senderName, reciever: other, senderSocketId: senderSocketId})}}
          >
            {retry}
  				</button>
          <button className="text-white font-bold text-2xl bg-red rounded-[10px] hover:bg-[#FBACB3]"
            onClick={() => {router.push("/game")}}
          >
   				    Leave {timeLeft}
  				</button>
        </div>
      </div>
    );
  }
};

