'use client';

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, Body, Composite} from "matter-js";
import socket from "../socketG";
import { drawRect, drawCircle } from "./draw";


interface Prop{
	roomid: string;
	me: string;
	RightPlayer: string
}
function DisapGame({roomid, me, RightPlayer} : Prop){
	const divRef = useRef<HTMLDivElement | null>(null);
	const [sx, setSx] = useState<number>(1);
	const [sy, setSy] = useState<number>(1);
	let keyClicked : boolean = false;

	useEffect(() => {
		if (roomid!== '')
		{
			const handleKeyDown = (e: KeyboardEvent) => {
				if (!keyClicked)
				{
					if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
					{
						keyClicked = true;
						if (me === RightPlayer) {
							socket.emit('rightPaddle', 
							{
								direction: e.key,
								room: roomid,
							});
						}
						else {
							socket.emit('leftPaddle', 
							{
								direction: e.key,
								room: roomid,
							});
						}
					}
				}
			}

			const handlekeyUp = (e: KeyboardEvent) => {
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
				{
					keyClicked = false;
					if (me === RightPlayer) {
						socket.emit('rightPaddle', 
						{
							direction: 'stop',
							room: roomid,
						});
					}
					else {
						socket.emit('leftPaddle', 
						{
							direction: 'stop',
							room: roomid,
						});
					}
				}
			}

			
			if (!divRef.current) return;
			
			const H = 900;
			const W = 1700;
			
			let engine = Engine.create(),
			render = Render.create({
				engine: engine,
				element: divRef.current,
				options: {
					width: W,
					height: H,
					pixelRatio: 1,
					wireframes: false,
					background: "#FF6000",
				}
			});

			const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#4C3D3D');
			const leftBoard = drawRect(35, H / 2, 20, 120, '#4C3D3D');

			const ball = drawCircle(W / 2, H / 2, 15, '#FFE6C7');
			Composite.add(engine.world, [ball, rightBoard, leftBoard]);
			document.addEventListener('keyup', handlekeyUp);
			document.addEventListener('keydown', handleKeyDown);
			Render.run(render);
			
			socket.on('sound', () => {
				const audio = new Audio('/game/bounce.mp3');
				audio.play();
			});
			
			socket.on('positions', (data) => {
				Body.setPosition(
					rightBoard,
					{
						x: data.rightBoardX,
						y: data.rightBoardY,
					}
					);
					Body.setPosition(
						leftBoard,
						{
							x: data.leftBoardX,
							y: data.leftBoardY,
						}
						);
					});
					socket.on('ball', ({x, y}) => {
						Body.setPosition(
							ball,
							{
								x: x,
								y: y,
							}
							);
						});
						
						return () => {
							document.removeEventListener('keyup', handlekeyUp);
							document.removeEventListener('keydown', handleKeyDown);
							socket.off('positions');
							socket.off('ball');
							socket.off('sound');
							Engine.clear(engine);
							Render.stop(render);
						};
					}
				}, [roomid]);
				
				useEffect(() => {
					let canvasWidth: number = 1700;
					let canvasHeight: number = 900;
				  
					let windowWidth: number = window.innerWidth;
					let windowHeight: number = window.innerHeight;
				  
					let scaleFactor: number = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
				  
					let scalex: number = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
					let scaley: number = scaleFactor > 1 ? 1 : scaleFactor * 0.85; // adding the navbar height
					setSx(scalex);
					setSy(scaley);
					window.addEventListener("resize", handleResize);
					
					function handleResize(){
					  windowWidth = window.innerWidth;
					  windowHeight = window.innerHeight;
					  scaleFactor = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
					  scalex = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
					  scaley = scaleFactor > 0.95 ? 1 : scaleFactor * 0.85; // adding the navbar height
					  setSx(scalex);
					  setSy(scaley);
					}
					
					return () => {
					  window.removeEventListener("resize", handleResize);
					}
				  }, []);
				
				return (
					<div ref={divRef} 
					className="h-[900px] w-[1700px] mt-20 relative"
					style={{
				transform: `scale(${sx}, ${sy})`,
			}}
			>
			<div className="h-full w-1 bg-white absolute left-1/2 transform -translate-x-1/2">
			<div className="bg-white w-full" style={{backgroundImage: 'repeating-linear-gradient(2deg, transparent, transparent 40px, white 40px, white 80px)'}}></div>
			</div>
		</div>
	);
}
export default DisapGame;

