"use client";

import React, { useEffect, useState } from "react";
import PlayersScore from "@/components/game/score";
import Won from "@/components/game/winner";
import Lost from "@/components/game/loser";
import { useRouter } from "next/navigation";
import socket from "@/components/socketG";
import DefaultGame from "./defaultGame";
import FootGame from "./footGame";
import DisapGame from "./disapearGame";

interface Prop{
	me: string;
}

export default function Game({me} : Prop){
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	const [LeftPlayer, setLeftPlayer] = useState<string>('');
	const [RightPlayer, setRightPlayer] = useState<string>('');
	const [roomid, setRoomid] = useState<string>('');
	const [Winner, setWinner] = useState<string>('');
	const [Loser, setLoser] = useState<string>('');
	const [map, setMap] = useState<string>('default');

	useEffect(() => {
		let seleted: string | null = localStorage.getItem('map');
		if (seleted !== null) setMap(seleted);

		socket.emit('full-Game', me);
		socket.on('game-info', (data) => {
			setLeftPlayer(data.leftPlayer);
			setRightPlayer(data.rightPlayer);
			setRoomid(data.room);
		});
		return () => {
			socket.off('game-info');
		}
	  }, []);
	
	useEffect(() => {
		socket.on('score', (data) => {
			setLeftScore(data.leftScore);
			setRightScore(data.rightScore);
		});
		socket.on('winner', (data) => {
			if(me === RightPlayer){
				if (data === 'right') setWinner(RightPlayer);
				else setLoser(RightPlayer);
			}
			else{
				if (data === 'left') setWinner(LeftPlayer);
				else setLoser(LeftPlayer);
			}
	});
	return () => {
		socket.off('score');
		socket.off('winner');
	}
}, [rightScore, leftScore, LeftPlayer, RightPlayer]); 

	useEffect(() => {
		if (countDownValue == 0) {
		  setPVisible(false);
		} else {
		  setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
		}
	  }, [countDownValue]);

	return (
	<>
		{(Winner === '' && Loser === '') && <div className="flex justify-center  items-center h-full w-full bg-[#384259]">
			{(PVisible && !leftScore && !rightScore) && <p className="absolute font-bold text-[#ffffff] text-[90px] mb-[150px] ">{countDownValue}</p>}
			<PlayersScore 
			left={leftScore} 
			right={rightScore} 
			leftPlayer={LeftPlayer}
			rightPlayer={RightPlayer}
			/>

			{map === "default" && <DefaultGame
			roomid={roomid}
			me={me}
			RightPlayer={RightPlayer}
			/>}

			{map === "m3a-m3a" && <FootGame
			roomid={roomid}
			me={me}
			RightPlayer={RightPlayer}
			/>}

			{map === "ched-ched" && <DisapGame
			roomid={roomid}
			me={me}
			RightPlayer={RightPlayer}
			/>}

			<button 
				className="absolute bottom-[50px] right-[50px]  m-4  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]" 
				onClick={() => {
					socket.emit('leave-game', {
						room: roomid,
						player: me,
					});
					router.push("/home");
				}}>
				leave
			</button>
		</div>}
		{Winner !== '' && <Won setLost={setLoser} setWon={setWinner} />}
		{Loser !== '' && <Lost setLost={setLoser} setWon={setWinner} />}
	</>
	);
}