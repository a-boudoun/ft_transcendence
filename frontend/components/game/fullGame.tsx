"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events, Bodies, Composite, Query} from "matter-js";
import PlayersScore from "@/components/game/score";
import { drawRect, drawCircle } from "@/components/game/draw";
import { useRouter } from "next/navigation";
import socket from "@/components/socketG";
import axios from "axios";
import { set } from "zod";

interface GameH{
	loserScore: number;
	loser: string;
}

interface Prop{
	me: string;
	setGame: (val: boolean) => void;
	setMatch: (val: number) => void;
}

export default function Game({me, setGame, setMatch} : Prop){
	const storeGameHistory = useMutation({
		mutationKey: ["storeGameHistory"],
		mutationFn: async (a :GameH) => {
			const { data } = await axios.post(`http://localhost:8000/gameHistory`, a, { withCredentials: true });
			return data;
		},
		onSuccess: () => {
			console.log("success");
		}
	});
	const divRef = useRef<HTMLDivElement | null>(null);
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	const [LeftPlayer, setLeftPlayer] = useState<string>('');
	const [RightPlayer, setRightPlayer] = useState<string>('');
	const [roomid, setRoomid] = useState<string>('');
	let sx : number = 1;
	let sy : number = 1;

	useEffect(() => {
		socket.emit('full-Game', me);
		socket.on('sound', () => {
			const audio = new Audio('/game/bounce.mp3');
			audio.play();
		});
		socket.on('game-info', (data) => {
			setLeftPlayer(data.leftPlayer);
			setRightPlayer(data.rightPlayer);
			setRoomid(data.room);
		});
		return () => {
			socket.off('game-info');
			socket.off('sound');
		}
	  }, []);

	useEffect(() => {
		if (roomid!== '')
		{
			const handleResize = () => {
				if (!divRef.current) return;

					render.canvas.width = divRef.current.offsetWidth;
					render.canvas.height = divRef.current.offsetHeight;
					sx = divRef.current.offsetWidth / 2048;
					sy = divRef.current.offsetHeight / 890;
			}
			
			if (!divRef.current) return;
			
			const H = divRef.current.offsetHeight;
			const W = divRef.current.offsetWidth;
			sx = W / 2048;
			sy = H / 890;
			
			let engine = Engine.create(),
			render = Render.create({
				engine: engine,
				element: divRef.current,
				options: {
					width: W,
					height: H,
					pixelRatio: 1,
					wireframes: false,
					background: "#000000",
				}
			}),
			mouse = Mouse.create(render.canvas);

			const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#FFFFFF');
			const leftBoard = drawRect(35, H / 2, 20, 120, '#FFFFFF');

			const ball = drawCircle(W / 2, H / 2, 15, '#FFFFFF');
			Composite.add(engine.world, [ball, rightBoard, leftBoard]);
			window.addEventListener("resize", handleResize);
			// document.addEventListener('keydown', handleKeyDown);\
			Render.run(render);

			Events.on(render, 'afterRender', () => {
				if (me === RightPlayer) {
					socket.emit('rightPaddle', 
					{
						y: mouse.position.y / sy,
						room: roomid,
					});
				}
				else {
					socket.emit('leftPaddle', 
					{
						y: mouse.position.y / sy,
						room: roomid,
					});
				}
			});
			Events.on(render, 'afterRender', () => {
			if (!divRef.current || ball.position.y < 0 || ball.position.y > divRef.current.clientHeight) return;
				socket.on('positions', (data) => {
					Body.setPosition(
						rightBoard,
						{
							x: data.rightBoardX * sx,
							y: data.rightBoardY * sy,
						});
					Body.setPosition(
						leftBoard,
						{
							x: data.leftBoardX * sx,
							y: data.leftBoardY * sy,
						});
					});
				});
			socket.on('ball', ({x, y}) => {
				Body.setPosition(
					ball,
					{
						x: x * sx,
						y: y * sy,
					}
				);
			});
			
			return () => {
				window.removeEventListener("resize", handleResize);
				socket.off('positions');
				socket.off('ball');
				Engine.clear(engine);
				Render.stop(render);
			};
		}
	}, [roomid]);
	
	useEffect(() => {
		socket.on('score', (data) => {
			setLeftScore(data.leftScore);
			setRightScore(data.rightScore);
		});
		socket.on('left-game', () => {
			setGame(false);
			setMatch(0);
			router.push('/home');
		});
		socket.on('winner', (data) => {
			socket.emit('leave-game', {
				room: roomid,
				player: me,
			});
			if(me === RightPlayer){
				if (data === 'right') {
					// post (winner)
					storeGameHistory.mutate({loserScore: leftScore, loser: LeftPlayer});
					router.push('/game/winner');
				}
				else router.push('/game/loser')
			}
			else{
				if (data === 'left'){
					storeGameHistory.mutate({loserScore: rightScore, loser: RightPlayer});
					router.push('/game/winner')
					// post (winner)	
				} 
				else
				router.push('/game/loser')
		}
	});
	return () => {
		socket.off('score');
		socket.off('winner');
		socket.off('left-game');
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
    <div className="flex justify-center  items-center h-full w-full bg-[#384259]">
		{(PVisible && !leftScore && !rightScore) && <p className="absolute font-bold text-[#ffffff] text-[90px] mb-[150px] ">{countDownValue}</p>}
		<PlayersScore 
		left={leftScore} 
		right={rightScore} 
		leftPlayer={LeftPlayer}
		rightPlayer={RightPlayer}
		/>
    	<div
    	  ref={divRef}
    	  className="h-4/6 w-4/5 mt-20 cursor-none">
    	</div>
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
  </div>
	);
}