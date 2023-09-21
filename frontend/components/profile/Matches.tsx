"use client";

import Title from "@/components/profile/Title";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import Image from "next/image";
import Link from "next/link";
import { userDto } from "@/dto/userDto";
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
      <div className="flex flex-col items-center gap-4">
        <Link href={`/profile/${match.winner.id}`}>
          <Image
            className="rounded-full"
            src={match.winner.image}
            width={64}
            height={64}
            alt="user image"
          />
        </Link>
        <h3>{match.winner.id}</h3>
      </div>
      <span className="grow text-3xl mb-8">{`5 - ${match.loserScore}`} </span>
      <div className="flex flex-col items-center gap-4">
        <Link href={`/profile/${match.loser.id}`}>
          <Image
            className="rounded-full"
            src={match.loser.image}
            width={64}
            height={64}
            alt="user image"
          />
        </Link>
        <h3>{match.loser.id}</h3>
      </div>
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
      <div className="grow flex flex-col gap-1 p-4 overflow-y-scroll  xl:rounded-b-3xl">
        {Matchs.data.map((match: any) => {
          return <Match match={match} id={id} />;
        })}
      </div>
    );
  }
};

const MatchesHistory = ({ id }: { id: number }) => {
  return (
    <div className="max-h-[668px] flex flex-col grow xl:rounded-3xl xl:shadow-2xl xl:bg-white xl:bg-opacity-20 xl:ackdrop-blur-lg xl:drop-shadow-lg">
      <div className="hidden xl:block rounded-t-3xl  p-4 ">
        <Title isActive={true} str="Matches" src="/icons/profile/Matches.svg" />
      </div>
      <DisplayMatchs id={id} />
    </div>
  );
};

export default MatchesHistory;
