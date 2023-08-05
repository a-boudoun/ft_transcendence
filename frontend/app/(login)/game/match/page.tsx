'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import socket from '@/components/socketG';
import Image from "next/image";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

interface prop {
 clicked?: boolean;
 setClicked: (val: boolean) => void;
}

function LeftPlayer(){

	const {data, isLoading} = useQuery({
		queryKey: ['user'],
		queryFn: async ()=> {
		  const {data} = await axios.get('http://localhost:8000/users/me', { withCredentials: true })
		  return data;
		}
	  });
	if (isLoading) return <div>Loading...</div>;
	else{
		return (
			<div className = 'flex flex-col iterms-center justify-center w-[150px] h-[150px]'>
			<Image src={data.image} width={200} height={200} alt="avatar" className="w-full h-full rounded-full"/>
			<h1 className = 'pt-2 text-2xl font-bold'> {data.username} </h1>
		</div>
	)
}
}


function LoadingPlayer({setClicked}: prop){
// setClicked false 
	const [image, setImage] = useState<string>('/game/unknown.svg');
	const [name, setName] = useState<string>('searching...');


	const iamges = [
		"/game/man.png",
		"/game/man0.png",
		"/game/man1.png",
		"/game/man2.png",
		"/game/man3.png",
		"/game/man4.png",
		"/game/man5.png",
		"/game/man6.png",
		"/game/man7.png",
		"/game/man8.png",
		"/game/woman.png",
		"/game/woman1.png",
		"/game/woman2.png",
		"/game/woman3.png",
	];
	useEffect(() => {
		const interval = setInterval(() => {
			setImage(iamges[Math.floor(Math.random() * iamges.length)]);
		}, 200);

		socket.on('match-fount', (player: any) => {
			const {data} = useQuery({
				queryKey: ['user'],
				queryFn: async ()=> {
				  const {data} = await axios.get(`http://localhost:8000/users/${player.name}`, { withCredentials: true })
				  return data;
				}
			  });
			if (data) {
				setImage(data.image);
				setName(data.username);
			}
		});
		return () => {
			clearInterval(interval)
		};
	}, []);


	return (
		<>
			 <Image src={image} width={200} height={200} alt="avatar" className="w-full h-full rounded-full"/>
			 <h1 className = 'pt-2 text-2xl font-thin '> {name} </h1>
		</>
	)

}

function RightPlayer({ clicked, setClicked } : prop){

	useEffect(() => {

	}, []);
	return (
		<div className = 'flex flex-col iterms-center justify-center  w-[150px] h-[150px]'>
			{clicked? <LoadingPlayer setClicked={setClicked}/>  :   <Image src="/game/unknown.svg" width={200} height={200} alt="unkown" className="w-full h-full rounded-full"/>}
		</div>
	)
}

export default function MatchPlayers(){
	const [look, setLook] = useState<boolean>(false);

	return (
		<div className = 'flex flex-col items-center justify-center w-screen h-screen bg-dark-gray gap-2'>
			<main className = 'flex flex-row bg-[#384259] w-[500px] h-[300px] items-center justify-between px-8 rounded-[10px]'>
				<LeftPlayer/>
				<h1 className = 'text-white text-5xl font-serif'>VS</h1>
				<RightPlayer clicked={look} setClicked={setLook}/>
			</main>

			{ !look && <button 
			className=" w-full max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-red w-[150px] py-2 rounded-[10px] hover:bg-[#FBACB3] font-bold"
			onClick = {() => {
				setLook(true);
			}}>
			find a player
			</button>}

			{look && <button 
			className=" w-full max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-[#fc2e2e] py-2 w-[120px] rounded-[10px] hover:bg-[#f01f2d] font-bold"
			onClick = {() => {
				setLook(false);
			}}>
			cancel
			</button>}
		</div>
		)
}