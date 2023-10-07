'use client';

import React, { useEffect, useRef } from "react";
import {Engine, Render, Body, Composite, Bodies} from "matter-js";
import socket from "../socketG";
import { drawRect } from "./draw";


interface Prop{
	roomid: string;
	me: string;
	RightPlayer: string
}
function DefaultGame({roomid, me, RightPlayer} : Prop){
	const divRef = useRef<HTMLDivElement | null>(null);
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
					background: "/game/default.png",
				}
			});

			const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#FFFFFF');
			const leftBoard = drawRect(35, H / 2, 20, 120, '#FFFFFF');

			const ball = Bodies.circle(W / 2, H / 2, 15,{
				restitution: 1, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
				render: {
					// fillStyle: color,
					sprite: {
						texture: '/game/default-ball.webp',
						xScale: 0.07,
						yScale: 0.07,
					}
			},
			});
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

				return (
					<div ref={divRef} 
					className="shadow-[0px_20px_50px_0px_#86c3bb,0px_-10px_50px_0px_#d3455c]">
					</div>
	);
}
export default DefaultGame;