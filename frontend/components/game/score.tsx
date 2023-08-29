import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


interface score{
	left: number,
	right: number,
	leftPlayer: string,
	rightPlayer: string
}

interface pScore{
	score: number,
	name: string,
}

function MePlayer({ score, name} : pScore) {
	const {data, isLoading} = useQuery({
		queryKey: ['left'],
		queryFn: async ()=> {
		  const {data} = await axios.get(`http://localhost:8000/users/byUsername/${name}`, { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
		return (
			<div className="flex items-center gap-2">
				<div className="flex flex-col items-center w-[80px] h-[80px]">
					<Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
					<h1 className="text-[#F2F2F2] font-bold">{data.name}</h1>
				</div>
				<h1>
					score: {score}
				</h1>
			</div>
		);
	}
}

function OtherPlayer({ score, name } : pScore) {
	const {data, isLoading} = useQuery({
		queryKey: ['right'],
		queryFn: async ()=> {
		  const {data} = await axios.get(`http://localhost:8000/users/byUsername/${name}`, { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
		return (
			<div className="flex items-center gap-2">
				<h1>
					score: {score}
				</h1>
				<div className="flex flex-col items-center w-[80px] h-[80px]">
					<Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
					<h1 className="text-[#F2F2F2] font-bold">{data.name}</h1>
				</div>
			</div>
		);
	}
}

function PlayersScore({ left, right, leftPlayer, rightPlayer } : score) {

	return (
	  <div className="flex justify-between absolute top-[160px] left-[100px] right-[100px]">
		<MePlayer score={left} name={leftPlayer}/>
		<OtherPlayer score={right} name={rightPlayer}/>
	  </div>
	);
}

export default PlayersScore;