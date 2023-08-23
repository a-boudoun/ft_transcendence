'use client';

import { RightPlayer, LeftPlayer } from '@/components/game/PlayersMatch';
import { useEffect, useState } from 'react';
import socket from '@/components/socketG';
import axios from 'axios';

import  Game  from '@/components/game/fullGame';

export default function MatchPlayers() {
	const [look, setLook] = useState<number>(3);
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
			else if (status === 'not-looking')
				setLook(0);
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
			<main className = 'flex flex-row bg-[#384259] w-[500px] h-[300px] items-center justify-between px-8 rounded-[10px]'>
				<LeftPlayer/>
				<h1 className = 'text-white text-5xl font-serif'>VS</h1>
				<RightPlayer clicked={look} setClicked={setLook} setGame={setGameStart}/>
			</main>
			{ look !== 2 && <div>
				{ look === 0 && <button 
				className=" max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-red w-[250px] py-2 rounded-[10px] hover:bg-[#FBACB3] font-bold"
				onClick = {() => {
					socket.emit('looking-for-match', player);
					setLook(1);
				}}>
				find a player
				</button>}

				{look === 1 && <button 
				className=" max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-[#fc2e2e] py-2 w-[120px] rounded-[10px] hover:bg-[#f01f2d] font-bold"
				onClick = {() => {
					socket.emit('cancel-looking', player);
					setLook(0);
				}}>
				cancel
				</button>}
			</div>}
		</div>}
		{gameStart && <Game 
			me = {player} 
			setGame = {setGameStart}
			setMatch = {setLook}
		/>}
		</>
		)
}