"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events, Bodies, Composite, Query} from "matter-js";
import { drawRect, drawCircle } from "@components/draw";
import { useRouter } from "next/navigation";
import io from 'socket.io-client';

//// : implement the game logic in the backend and send the data to the frontend
//// : make the cnasvas responsive
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const usnm: number = randomInt(1, 1000);
const socket = io('http://localhost:8000', {
	query: {username: usnm.toString()},
});
export default function Game(){
	const divRef = useRef<HTMLDivElement | null>(null);
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	let roomid: string = '';
	let sender: boolean = false;
	let sx : number = 1;
	let sy : number = 1;

	useEffect(() => {
		socket.on('connect', () => {
		  console.log('Connected to server');
		});

		socket.on('sound', () => {
			const audio = new Audio('/game/bounce.mp3');
			audio.play();
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});
	
		socket.on('roomCreated', ({room: room, us: users}) => {
			roomid = room;
			const n1: number = parseInt(users[0]);
			const n2: number = parseInt(users[1]);
			sender = true ? usnm >= n1 && usnm >= n2 : false;
			console.log('Room created', room, 'with users', n1, n2);
			console.log('username', usnm);
			console.log('bigger', sender);
		});
	  }, []);

	useEffect(() => {

		const handleResize = () => {
			if (!divRef.current) return;

				render.canvas.width = divRef.current.offsetWidth;
				render.canvas.height = divRef.current.offsetHeight;
				sx = divRef.current.offsetWidth / 2048;
				sy = divRef.current.offsetHeight / 890;

				Body.setPosition(
					floor,
					{
						x: divRef.current.offsetWidth / 2,
						y: divRef.current.offsetHeight,
					}
				);
				Body.setPosition(
					ceiling,
					{
						x: divRef.current.offsetWidth / 2,
						y: 0,
					}
				);
		}
		
		if (!divRef.current) return;
		
		const H = divRef.current.offsetHeight;
		const W = divRef.current.offsetWidth;
		sx = W / 2048;
		sy = H / 890;
		
		let engine = Engine.create({
			enableSleeping: false, // Sleep the object when it is not moving
			constraintIterations: 4, // he higher quality the simulation will be at the expense of performance.
			gravity:{
				x:0,
				y:0,
				scale:0.001,
			},
		}),
		render = Render.create({
			engine: engine,
			element: divRef.current,
			options: {
				width: W,
				height: H,
				// rendering pixel to be more sharp
				pixelRatio: 1,
				wireframes: false,
				background: "#7AC7C4",
			}
		}),
		mouse = Mouse.create(render.canvas);

		const floor = drawRect(W / 2, H, 5000, 20, '#7AC7C4');
		const ceiling = drawRect(W / 2, 0, 5000, 20, '#7AC7C4');
		const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#F73859');
		const leftBoard = drawRect(35, H / 2, 20, 120, '#F73859');

		
		const ball = drawCircle(W / 2, H / 5, 20, '#384259');
		Composite.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard]);
		window.addEventListener("resize", handleResize);
		// document.addEventListener('keydown', handleKeyDown);\
		Render.run(render);

		setTimeout(() => {
			Events.on(render, 'afterRender', () => {
				if (sender) {
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
		}, 3000);

		return () => {
		  window.removeEventListener("resize", handleResize);
		};
		}, []);

		useEffect(() => {
			if (countDownValue == 0) {
			  setPVisible(false);
			} else {
			  setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
			}
		  }, [countDownValue]);

	return (
    <div className="flex justify-center items-center h-full w-full bg-[#384259]">
		{PVisible && <p className="absolute font-bold text-[#384259] text-[70px] ">{countDownValue}</p>}
    	<div
    	  ref={divRef}
    	  className="h-4/6 w-4/5 mt-20 cursor-none">
    	  {/* Your content goes here */}
    	</div>
		<button 
			className="absolute bottom-[50px] right-[50px]  m-4  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]" onClick={() => {router.push("/home")}}>
			leave
		</button>
  </div>
	);
}