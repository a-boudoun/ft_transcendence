import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";


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
	
	if (name === "me"){
		const {data, isLoading} = useQuery({
			queryKey: ['scoreleft'],
			queryFn: async ()=> {
			  const {data} = await axios.get(`/users/getUser/me`)
			  return data;
			}
		  });
		  if (isLoading) return <div>Loading...</div>;
		  else{
			  return (
				  <div className="flex items-center gap-2">
					  <div className="flex flex-col items-center w-[80px] h-[80px]">
						  <Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
						  <h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
					  </div>
					  <h1>
						  score: {score}
					  </h1>
				  </div>
			  );
		  }
	}
	else{
		const {data, isLoading} = useQuery({
			queryKey: ['scoreleft'],
			queryFn: async ()=> {
				const {data} = await axios.get(`/users/getId/${name}`)
				return data;
			}
		});
		if (isLoading) return <div>Loading...</div>;
		else{
			return (
				<div className="flex items-center gap-2">
					<div className="flex flex-col items-center w-[80px] h-[80px]">
						<Image src={data.image} width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
						<h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
					</div>
					<h1>
						score: {score}
					</h1>
				</div>
			);
		}
	}
}

function OtherPlayer({ score, name } : pScore) {
	if (name == "robot"){
		return (
			<div className="flex items-center gap-2">
				<div className="flex flex-col items-center w-[80px] h-[80px]">
					<Image src="/game/robot.svg" width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
					<h1 className="text-[#F2F2F2] font-bold">{name}</h1>
				</div>
				<h1>
					score: {score}
				</h1>
			</div>
		);
	}
	else{
		const {data, isLoading} = useQuery({
			queryKey: ['scoreright'],
			queryFn: async ()=> {
			const {data} = await axios.get(`/users/getId/${name}`)
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
						<h1 className="text-[#F2F2F2] font-bold">{data.username}</h1>
					</div>
				</div>
			);
		}
	}
}

function PlayersScore({ left, right, leftPlayer, rightPlayer } : score) {

	return (
	  <div className="flex justify-between absolute top-[160px] left-[100px] right-[100px]">
		<OtherPlayer score={left} name={leftPlayer}/>
		<MePlayer score={right} name={rightPlayer}/>
	  </div>
	);
}

export default PlayersScore;