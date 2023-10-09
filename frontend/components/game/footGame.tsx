'use client';

import React, { useEffect, useRef } from "react";
import {Engine, Render, Body, Composite, Bodies} from "matter-js";
import socket from "../socketG";


interface Prop{
	roomid: string;
	me: string;
	RightPlayer: string
}
function FootGame({roomid, me, RightPlayer} : Prop){
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
					background: "/game/pitch.jpg",
				}
			});

			const rightBoard = Bodies.rectangle(W - 35, H / 2, 20, 120,{
				isStatic: true,
				render: {
					sprite: {
						texture: '/game/rightglove.webp',
						xScale: 0.045,
						yScale: 0.05,
					}
			},
			});
			const leftBoard = Bodies.rectangle(35, H / 2, 20, 120,{
				isStatic: true,
				render: {
					sprite: {
						texture: '/game/leftglove.webp',
						xScale: 0.045,
						yScale: 0.05,
					}
			},
			});

			const ball = Bodies.circle(W / 2, H / 2, 15,{
				restitution: 1, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
				render: {
					// fillStyle: color,
					sprite: {
						texture: 'https://cdn.shopify.com/s/files/1/0009/2733/4466/products/755957ca0e8d95bb1d4e9ac2c8083de9.png?v=1539975508',
						xScale: 0.04,
						yScale: 0.04,
					}
			},
			});
			Composite.add(engine.world, [ball, rightBoard, leftBoard]);
			document.addEventListener('keyup', handlekeyUp);
			document.addEventListener('keydown', handleKeyDown);
			Render.run(render);
			
			socket.on('sound', () => {
				const audio = new Audio('/game/football.mp3');
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
					className="shadow-[0_20px_50px_rgba(_89,_203,_76,_1)]">
					</div>
				);
}
export default FootGame;
