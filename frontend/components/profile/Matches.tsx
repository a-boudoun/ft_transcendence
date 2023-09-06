"use client";

import Title from "@/components/profile/Title";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import Image from 'next/image';
import Link from "next/link";
import { useSelector } from "react-redux";

const Match = ({match} : {match : any}) => {
    const visitedUser  = useSelector((state: any) => state.globalState.visitedUser);
 
    const border = match.winner.name === visitedUser.name ? 'border-2 border-blue' : 'border-2 border-red';

    return (
        <div className={`flex justify-between items-center p-4 bg-dark-gray rounded-xl ${border}`}>
            <div className="flex flex-col items-center gap-4">
            <Link href={`/profile/${match.winner.name}`} >
                <Image className="rounded-full"  src={match.winner.image}  width={64}  height={64}   alt="user image"/>
            </Link>
                <h3>{match.winner.name}</h3>
            </div>
            <span className="grow text-3xl mb-8">{`5 - ${match.loserScore}`} </span>
            <div className="flex flex-col items-center gap-4">
            <Link href={`/profile/${match.loser.name}`} >
                <Image className="rounded-full"  src={match.loser.image}  width={64}  height={64}   alt="user image"/>
            </Link>
                <h3>{match.loser.name}</h3>
            </div>
        </div>
    )
}

const DisplayMatchs = ({id} : {id : string | null}) => {
    const Matchs = useQuery({
        queryKey: ['matches'],
        queryFn: async ()=> {
                (id ? id = id : id = 'me')
                const { data } = await axios.get(`http://localhost:8000/gameHistory/getHistory/${id}`, { withCredentials: true });
                return data;
            }
    });
    if (Matchs.isLoading) 
        return (<div className="">loading... </div>)
    else
    {
        return (
            <div className="grow flex flex-col gap-1 bg-light-gray p-4 overflow-y-scroll  xl:rounded-b-3xl">
            {
                Matchs.data.map((match: any) => {
                    return (
                        <Match match={match} />
                    );
                })
            }
            </div>
        )
    }
}

const MatchesHistory = ({id} : {id : string | null}) => {

    return (
            <div className="xl:max-h-[668px] xl:flex xl:flex-col xl:grow xl:rounded-3xl xl:shadow-2xl">
                <div className="hidden xl:block xl:bg-light-gray xl:rounded-t-3xl xl:p-4 ">
                    <Title isActive={true} str='Matches' src='/icons/profile/Matches.svg'/>
                </div>
                <DisplayMatchs id={id} />
            </div>
    )
};

export default MatchesHistory;