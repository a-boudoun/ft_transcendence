import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";

interface score {
  left: number;
  right: number;
  leftPlayer: string;
  rightPlayer: string;
}

interface pScore {
  score: number;
  name: string;
}

function MePlayer({ score, name }: pScore) {
  if (name === "me") {
    const { data, isLoading } = useQuery({
      queryKey: ["scoreleft"],
      queryFn: async () => {
        const { data } = await axios.get(`/users/getUser/me`);
        return data;
      },
    });
    if (isLoading) return <div>Loading...</div>;
    else {
      return (
        <div className="flex items-center gap-4">
          <h1 className="text-blue text-3xl">{score}</h1>
          <div className="flex flex-col items-center">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
              <Image
                src={data.image}
                width={100}
                height={100}
                alt="#"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
          </div>
        </div>
      );
    }
  } else {
    const { data, isLoading } = useQuery({
      queryKey: ["scoreleft"],
      queryFn: async () => {
        const { data } = await axios.get(`/users/getId/${name}`);
        return data;
      },
    });
    if (isLoading) return <div>Loading...</div>;
    else {
      return (
        <div className="flex items-center gap-4">
          <h1 className="text-blue text-3xl">{score}</h1>
          <div className="flex flex-col items-center">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
              <Image
                src={data.image}
                width={100}
                height={100}
                alt="#"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
          </div>
        </div>
      );
    }
  }
}

function OtherPlayer({ score, name }: pScore) {
  if (name == "robot") {
    return (
      <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
        <Image
          src="/game/robot.webp"
          width={100}
          height={100}
          alt="#"
          className="w-full h-full object-cover object-center"
        />
        </div>
        <h1 className="text-[#F2F2F2] font-bold">boot</h1>
      </div>
      <h1 className="text-blue text-3xl">{score}</h1>
      </div>
    );
  } else {
    const { data, isLoading } = useQuery({
      queryKey: ["scoreright"],
      queryFn: async () => {
        const { data } = await axios.get(`/users/getId/${name}`);
        return data;
      },
    });
    if (isLoading) return <div>Loading...</div>;
    else {
      return (
		<div className="flex items-center gap-4">
		<div className="flex flex-col items-center">
		  <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
			<Image
			  src={data.image}
			  width={100}
			  height={100}
			  alt="#"
			  className="w-full h-full object-cover object-center"
			/>
		  </div>
		  <h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
		</div>
		<h1 className="text-blue text-3xl">{score}</h1>
	  </div>
      );
    }
  }
}

function PlayersScore({ left, right, leftPlayer, rightPlayer }: score) {
  return (
    <div className="flex justify-between">
      <OtherPlayer score={left} name={leftPlayer} />
      <MePlayer score={right} name={rightPlayer} />
    </div>
  );
}

export default PlayersScore;
