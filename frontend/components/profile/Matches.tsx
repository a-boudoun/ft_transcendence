"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import Image from "next/image";
import Link from "next/link";
import { userDto } from "@/dto/userDto";
import { History } from "lucide-react";
interface MatchProps {
  winner: userDto;
  loser: userDto;
  loserScore: number;
}

const Match = ({ match, id }: { match: MatchProps; id: number }) => {
  const border =
    match.winner.id === id ? "border-2 border-blue" : "border-2 border-red";

  return (
    <div
      className={`flex justify-between items-center p-4 rounded-xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg ${border} `}
    >
      <Link
        className="flex flex-col items-center gap-2"
        href={`/profile/${match.winner.username}`}
      >
        <div className="h-[64px] w-[64px] rounded-full overflow-hidden">
          <Image
            className="h-full w-full"
            src={match.winner.image}
            width={64}
            height={64}
            alt="user image"
          />
        </div>
        <h3>{match.winner.username}</h3>
      </Link>
      <span className="grow text-3xl mb-8">{`5 - ${match.loserScore}`} </span>
      <Link
        className="flex flex-col items-center gap-2"
        href={`/profile/${match.loser.username}`}
      >
        <div className="h-[64px] w-[64px] rounded-full overflow-hidden">
          <Image
            className="h-full w-full"
            src={match.loser.image}
            width={64}
            height={64}
            alt="user image"
          />
        </div>
        <h3>{match.loser.username}</h3>
      </Link>
    </div>
  );
};

const DisplayMatchs = ({ id }: { id: number }) => {
  const Matchs = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await axios.get(`/gameHistory/getHistory/${id}`);
      return data;
    },
  });
  if (Matchs.isLoading) return <div> loading... </div>;
  else {
    return (
      <div className="grow flex flex-col gap-4 p-4 overflow-auto scrollbar	xl:rounded-b-3xl">
        {Matchs.data.map((match: any) => {
          return <Match key={match.id} match={match} id={id} />;
        })}
      </div>
    );
  }
};

const MatchesHistory = ({ id }: { id: number }) => {
  return (
    <div className="flex-[0.5]  flex flex-col xl:rounded-3xl xl:shadow-2xl xl:bg-white xl:bg-opacity-20 xl:ackdrop-blur-lg xl:drop-shadow-lg overflow-hidden">
      <div className="hidden xl:block rounded-t-3xl  p-4 ">
        <div
          className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 border-b border-blue`}
        >
          <History size={28} color="#7ac7c4" strokeWidth={2} />
          <h2 className="hidden lg:inline text-[28px] ml-4">Matches</h2>
        </div>
      </div>
      <DisplayMatchs id={id} />
    </div>
  );
};

export default MatchesHistory;
