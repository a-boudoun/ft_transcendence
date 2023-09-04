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
	let sx : number = 1;
	let sy : number = 1;
	let keyClicked : boolean = false;

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
					background: "#FF6000",
				}
			});

			const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#4C3D3D');
			const leftBoard = drawRect(35, H / 2, 20, 120, '#4C3D3D');

			const ball = drawCircle(W / 2, H / 2, 15, '#FFE6C7');
			Composite.add(engine.world, [ball, rightBoard, leftBoard]);
			window.addEventListener("resize", handleResize);
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
						x: data.rightBoardX * sx,
						y: data.rightBoardY * sy,
					}
				);
				Body.setPosition(
					leftBoard,
					{
						x: data.leftBoardX * sx,
						y: data.leftBoardY * sy,
					}
				);
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

	return (
		<div ref={divRef} className="h-4/6 w-4/5 mt-20 relative">
			<div className="h-full w-1 bg-white absolute left-1/2 transform -translate-x-1/2">
			<div className="bg-white w-full" style={{backgroundImage: 'repeating-linear-gradient(2deg, transparent, transparent 40px, white 40px, white 80px)'}}></div>
			</div>
		</div>
	);
}
export default DisapGame;