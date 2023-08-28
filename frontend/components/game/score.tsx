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

interface right{
	right: number,
	rightPlayer: string,
}

interface left{
	left: number,
	leftPlayer: string,
}

function MePlayer({ left, leftPlayer} : left) {
	const {data, isLoading} = useQuery({
		queryKey: ['left'],
		queryFn: async ()=> {
		  const {data} = await axios.get(`http://localhost:8000/users/${leftPlayer}`, { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
		return (
			<div className="flex items-center gap-2">
				<div className="flex flex-col items-center w-[80px] h-[80px]">
					<Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
					<h1 className="text-[#F2F2F2] font-bold">{leftPlayer}</h1>
				</div>
				<h1>
					score: {left}
				</h1>
			</div>
		);
	}
}

function OtherPlayer({ right, rightPlayer } : right) {
	const {data, isLoading} = useQuery({
		queryKey: ['right'],
		queryFn: async ()=> {
		  const {data} = await axios.get(`http://localhost:8000/users/${rightPlayer}`, { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
		return (
			<div className="flex items-center gap-2">
				<h1>
					score: {right}
				</h1>
				<div className="flex flex-col items-center w-[80px] h-[80px]">
					<Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
					<h1 className="text-[#F2F2F2] font-bold">{rightPlayer}</h1>
				</div>
			</div>
		);
	}
}

function PlayersScore({ left, right, leftPlayer, rightPlayer } : score) {

	return (
	  <div className="flex justify-between absolute top-[160px] left-[100px] right-[100px]">
		<MePlayer left={left} leftPlayer={leftPlayer}/>
		<OtherPlayer right={right} rightPlayer={rightPlayer}/>
	  </div>
	);
}

export default PlayersScore;