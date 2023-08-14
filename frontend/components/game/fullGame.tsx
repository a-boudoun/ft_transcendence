"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events, Bodies, Composite, Query} from "matter-js";
import PlayersScore from "@/components/game/score";
import { drawRect, drawCircle } from "@/components/game/draw";
import { useRouter } from "next/navigation";
import socket from "@/components/socketG";


export default function Game({me} : {me: string}){
	const divRef = useRef<HTMLDivElement | null>(null);
	// const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	// const [countDownValue, setCountDownValue] = useState<number>(3);
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	const [LeftPlayer, setLeftPlayer] = useState<string>('');
	const [RightPlayer, setRightPlayer] = useState<string>('');
	// const [roomid, setRoomid] = useState<string>('');
	let roomid : string = '';
	let sx : number = 1;
	let sy : number = 1;

	useEffect(() => {
		socket.emit('full-Game', me);
		socket.on('sound', () => {
			const audio = new Audio('/game/bounce.mp3');
			audio.play();
		});
		socket.on('game-info', (data) => {
			roomid = data.room;
			setLeftPlayer(data.leftPlayer);
			setRightPlayer(data.rightPlayer);
			// setRoomid(data.room);
		});
		return () => {
			socket.off('game-info');
			socket.off('sound');
		}
	  }, []);

	useEffect(() => {

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
				background: "#7AC7C4",
			}
		}),
		mouse = Mouse.create(render.canvas);

		const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#F73859');
		const leftBoard = drawRect(35, H / 2, 20, 120, '#F73859');

		
		const ball = drawCircle(W / 2, H / 2, 15, '#384259');
		Composite.add(engine.world, [ball, rightBoard, leftBoard]);
		window.addEventListener("resize", handleResize);
		// document.addEventListener('keydown', handleKeyDown);\
		Render.run(render);

			Events.on(render, 'afterRender', () => {
				if (me === RightPlayer) {
					socket.emit('rightPaddle', 
					{
						y: mouse.position.y,
						room: roomid,
					});
				}
				else {
					socket.emit('leftPaddle', 
					{
						y: mouse.position.y,
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
			socket.on('score', (data) => {
				setLeftScore(data.leftScore);
				setRightScore(data.rightScore);
			});
			socket.on('winner', (data) => {
				socket.emit('endGame', {room: roomid});
				if(me === RightPlayer){
					if (data === 'right') router.push('/game/winner')
					else router.push('/game/loser')
				}
				else{
					if (data === 'left') router.push('/game/winner')
					else router.push('/game/loser')
				}
			});

		return () => {
		  window.removeEventListener("resize", handleResize);
		};
		}, []);

		// useEffect(() => {
		// 	if (countDownValue == 0) {
		// 	  setPVisible(false);
		// 	} else {
		// 	  setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
		// 	}
		//   }, [countDownValue]);

	return (
    <div className="flex justify-center items-center h-full w-full bg-[#384259]">
		{/* {PVisible && <p className="absolute font-bold text-[#384259] text-[70px] ">{countDownValue}</p>} */}
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