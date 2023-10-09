"use client";

import React from "react";
import Image from "next/image";
import axios from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import socket from "@/components/socketG";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface prop {
  setWon: (val: string) => void;
  setLost: (val: string) => void;
  me: string;
  other: string;
}

export default function Won({ setWon, setLost, me, other }: prop) {
  const router = useRouter();
  const [event, setEvent] = useState<string>("retry-game");
  const [senderName, setSenderName] = useState<string>(me);
  const [senderSocketId, setSenderSocketId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [retry, setRetry] = useState<string>("Retry");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      router.push("/game");
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  socket.on("refresh-page", () => {
    setWon("");
    setLost("");
  });

  socket.on("retry-game", (data: any) => {
    setSenderName(data.sender);
    setSenderSocketId(data.senderSocketId);
    setEvent("accept-retry");
    setRetry("Click to retry");
  });

  const { data, isLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await axios.get("/users/getUser/me");
      return data;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  else {
    return (
      <main className="h-full w-full grid place-content-center pt-14">
        <div className="flex flex-col items-center gap-8 sm:px-16 sm:py-24 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
          <h1 className="text-6xl font-bold text-[#4bff60f5] ">You Won</h1>
          <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border-black rounded-full overflow-hidden ">
            <Image
              width={400}
              height={0}
              alt="#"
              src={data.image}
              className="h-full w-full l"
            />
          </div>
          <div className="flex gap-10 ">
            <button
              className="font-bold text-3xl bg-red py-2 px-8 rounded-[10px] hover:bg-[#FBACB3]"
              onClick={() => {
                socket.emit(event, {
                  senderUsername: senderName,
                  reciever: other,
                  senderSocketId: senderSocketId,
                });
              }}
            >
              {retry}
            </button>
            <button
              className="font-bold text-3xl bg-red py-2 px-8 rounded-[10px] hover:bg-[#FBACB3]"
              onClick={() => {
                router.push("/game");
              }}
            >
              Leave {timeLeft}
            </button>
          </div>
        </div>
      </main>
    );
  }
}
