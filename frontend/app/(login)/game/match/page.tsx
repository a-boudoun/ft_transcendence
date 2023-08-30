'use client';

import { RightPlayer, LeftPlayer } from '@/components/game/PlayersMatch';
import { useEffect, useState } from 'react';
import socket from '@/components/socketG';
import axios from 'axios';

import  Game  from '@/components/game/fullGame';

export default function MatchPlayers() {
	const [look, setLook] = useState<number>(1);
	const [player, setPlayer] = useState<string>('');
	const [isPlayerFetched, setIsPlayerFetched] = useState<boolean>(false);
	const [gameStart, setGameStart] = useState<boolean>(false);
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const { data } = await axios.get(`http://localhost:8000/users/me`, { withCredentials: true });
		  if (data) {
			setPlayer(data.username);
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
			socket.emit('player-status', player);
		}
		socket.on('player-status', (status) => {
			if (status === 'already-looking')
		  		setLook(1);
			else if (status === 'not-looking'){
				socket.emit('looking-for-match', player)
				setLook(1);
			}
			else
				setGameStart(true);
		});
		return () => {
		  socket.off('player-status');
		};
	}, [isPlayerFetched, player]);

	return (

		<>
		{ !gameStart && <div className = 'flex flex-col items-center justify-center w-screen h-screen bg-dark-gray gap-2'>
		<main className="bg-dark-gray  pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center">
			<div className = 'flex flex-col gap-8 sm:flex-row bg-[#384259] items-center justify-between p-8 rounded-2xl'>
				<LeftPlayer/>
				<h1 className ='text-5xl font-serif'>VS</h1>
				<RightPlayer clicked={look} setClicked={setLook} setGame={setGameStart}/>
			</div>
		</main>
		</div>}
		{gameStart && <Game 
			me = {player} 
			setGame = {setGameStart}
			setMatch = {setLook}
		/>}
		</>
		)
}