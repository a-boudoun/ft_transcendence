'use client';

import React, { use } from 'react';
import { useEffect, useState } from 'react';
import socket from '@/components/socketG';
import { io } from "socket.io-client";
import Image from "next/image";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { set } from 'zod';

interface prop {
 clicked?: number;
 setClicked: (val: number) => void;
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

		setTimeout(() => {
			console.log('match found timeout');
			socket.emit("match-found", {player: "aboudoun"});
		}, 3000);

		socket.on('match-found', (player: any) => {
			console.log('match found on');
			// const {data} = useQuery({
			// 	queryKey: ['user'],
			// 	queryFn: async ()=> {
			// 	  const {data} = await axios.get(`http://localhost:8000/users/${player}`, { withCredentials: true })
			// 	  return data;
			// 	}
			//   });
			//   if (data) {
				clearInterval(interval);
				setClicked(3);
				setImage('/icons/avatar.svg');
				setName(player);
				// }
			});
			return () => {
				socket.off('match-found');
				clearInterval(interval);
			};
		}, []);
		
		
		return (
			<>
			 <Image src={image} width={200} height={200} alt="avatar" className="w-full h-full rounded-full"/>
			 <h1 className = 'pt-2 text-2xl font-bold '> {name} </h1>
		</>
	)
	
}

function RightPlayer({ clicked, setClicked } : prop){
	
	return (
		<div className = 'flex flex-col iterms-center justify-center  w-[150px] h-[150px]'>
			{clicked? <LoadingPlayer setClicked={setClicked}/>  :   <Image src="/game/unknown.svg" width={200} height={200} alt="unkown" className="w-full h-full rounded-full"/>}
		</div>
	)
}

export default function MatchPlayers(){
	const [look, setLook] = useState<number>(0);

	useEffect(() => {
		socket.emit('main-comp');
		socket.on('connect', () => {
			console.log('connected-main');
		});
	}, []);

	return (
		<div className = 'flex flex-col items-center justify-center w-screen h-screen bg-dark-gray gap-2'>
			<main className = 'flex flex-row bg-[#384259] w-[500px] h-[300px] items-center justify-between px-8 rounded-[10px]'>
				<LeftPlayer/>
				<h1 className = 'text-white text-5xl font-serif'>VS</h1>
				<RightPlayer clicked={look} setClicked={setLook}/>
			</main>
			{ look !== 3 && <div>
				{ look === 0 && <button 
				className=" max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-red w-[250px] py-2 rounded-[10px] hover:bg-[#FBACB3] font-bold"
				onClick = {() => {
					socket.emit('looking-for-match');
					setLook(1);
				}}>
				find a player
				</button>}

				{look === 1 && <button 
				className=" max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-[#fc2e2e] py-2 w-[120px] rounded-[10px] hover:bg-[#f01f2d] font-bold"
				onClick = {() => {
					socket.emit('cancel-looking');
					setLook(0);
				}}>
				cancel
				</button>}
			</div>}
		</div>
		)
}