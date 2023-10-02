'use client';

import { LoadingPlayer, LeftPlayer } from '@/components/game/PlayersMatch';
import {useState } from 'react';
import socket from '@/components/socketG';
import axios from '@/apis/axios';
import { useQuery } from "@tanstack/react-query";

import  Game  from '@/components/game/fullGame';

export default function MatchPlayers() {
	const [gameStart, setGameStart] = useState<boolean>(false);


	const user = useQuery({
		queryKey: ["user", "me"],
		queryFn: async () => {
			const { data } = await axios.get(`/users/getUser/me`);
			return data;
		},
		onSuccess: () => {
			socket.emit('player-status', user.data.id);

			socket.on('player-status', (status : string)=> {
				if (status === 'not-looking'){
					socket.emit('looking-for-match', user.data.id)
				}
				else{
					setGameStart(true);
				}
			});
		}
	  });
	
	return (

		<>
			{ !gameStart && <div className = 'flex flex-col items-center justify-center w-screen h-screen gap-2'>
			<main className=" pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center">
				<div className = 'flex flex-col gap-8 sm:flex-row bg-[#4f5a748a] items-center justify-between p-8 rounded-2xl'>
					<LeftPlayer/>
					<h1 className ='text-5xl font-serif'>VS</h1>
					<LoadingPlayer setGame={setGameStart}/>
				</div>
			</main>
			</div>}
			{ gameStart  && (user.isLoading ?  <div>loading... </div>  :
			<Game meId = {user.data.id} /> )
			}
		</>
		);
}