'use client';

import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import socket from '@/components/socketG';
import axios from 'axios';

interface prop {
	clicked?: number;
	setClicked: (val: number) => void;
	setGame: (val: boolean) => void;
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
		<div className = 'flex flex-col iterms-center justify-center'>
			<Image src={data.image} width={150} height={150} alt="avatar" className="rounded-full"/>
			<h1 className = 'pt-2 text-2xl font-bold'> {data.name} </h1>
		</div>
	)
}
}

function LoadingPlayer({setClicked, setGame}: prop){
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
	
			socket.on('match-found', async (player: string) => {
				try {
					const { data } = await axios.get(`http://localhost:8000/users/byUsername/${player}`, { withCredentials: true });
					setName(data.name);
					setImage(data.image);
					clearInterval(interval);
					setTimeout(() => {
						setGame(true);
					}, 800);
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
				});
				return () => {
					socket.off('match-found');
					clearInterval(interval);
				};
			}, []);
			
			return (
				<>
				  <Image src={image} width={150} height={150} alt="avatar" className="rounded-full"/>
				  <h1 className = 'pt-2 text-2xl font-bold '> {name} </h1>
				</>
		)
	}
	
	function RightPlayer({ clicked, setClicked, setGame } : prop){
		
		return (
			<div className = 'flex flex-col iterms-center justify-center'>
				{clicked === 1 ? <LoadingPlayer setClicked={setClicked} setGame={setGame}/>  :   <Image src="/game/unknown.svg" width={200} height={200} alt="unkown" className="w-full h-full rounded-full"/>}
			</div>
		)
	}

	export {LeftPlayer, RightPlayer}