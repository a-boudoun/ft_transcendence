'use client';

import { LoadingPlayer, LeftPlayer } from '@/components/game/PlayersMatch';
import { useEffect, useState } from 'react';
import socket from '@/components/socketG';
import axios from '@/apis/axios';

import  Game  from '@/components/game/fullGame';

export default function MatchPlayers() {
	const [playerId, setPlayerId] = useState<string>('');
	const [isPlayerFetched, setIsPlayerFetched] = useState<boolean>(false);
	const [gameStart, setGameStart] = useState<boolean>(false);
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const { data } = await axios.get(`/users/getUser/me`);
		  if (data) {
			setPlayerId(data.id);
			setIsPlayerFetched(true);
		  }
		} catch (error) {
		  console.error('Error fetching user data:', error);
		}
	  };
	  fetchData();
	}, []);
	
	useEffect(() => {
		if (isPlayerFetched) {
			socket.emit('player-status', playerId);
		}
		socket.on('player-status', (status : string)=> {
			if (status === 'not-looking'){
				socket.emit('looking-for-match', playerId)
			}
			else
				setGameStart(true);
		});
		return () => {
		  socket.off('player-status');
		};
	}, [isPlayerFetched, playerId]);

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
		{gameStart && isPlayerFetched && <Game 
			meId = {playerId}
		/>}
		</>
		)
}