'use client';

import React, { useEffect, useRef } from "react";
import {Engine, Render, Bodies, Body, Composite} from "matter-js";
import socket from "../socketG";


interface Prop{
	roomid: string;
	me: string;
	RightPlayer: string
}
function DisapGame({roomid, me, RightPlayer} : Prop){
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
			
			const balckHoleCollision = (ball : any, blackhole : any) : boolean => {
				return ( (blackHole.position.x - 100 <= ball.position.x && ball.position.x <= blackHole.position.x + 100)
					&& (blackHole.position.y - 100 <= ball.position.y && ball.position.y <= blackHole.position.y + 100))

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
					background: 'url("https://i.pinimg.com/originals/3a/0b/40/3a0b40d96c53860572a1c29970ce14a8.gif")',
					// backgroundSize: 'cover', // Adjust as needed
				}
			});

			const rightBoard = Bodies.rectangle(W - 35, H / 2, 20, 120,{
				isStatic: true,
				render: {
					sprite: {
						texture: '/game/space-paddle.webp',
						xScale: 0.07,
						yScale: 0.19,
					}
			},
			});
			const leftBoard = Bodies.rectangle(35, H / 2, 20, 120,{
				isStatic: true,
				render: {
					sprite: {
						texture: '/game/space-paddle.webp',
						xScale: 0.07,
						yScale: 0.19,
					}
			},
			});

			const ball = Bodies.circle(W / 2, H / 2, 15,{
				restitution: 1, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
				render: {
					sprite: {
						texture: '/game/space-rock.webp',
						xScale: 0.08,
						yScale: 0.08,
					}
				},
			});
			
			const blackHole = Bodies.circle( 2000, 2000, 100, {
				isStatic: true, // Make it immovable
				render: {
					sprite: {
						texture: '/game/blackhole.webp',
						xScale: 0.08,
						yScale: 0.08,
					},
				},
			  });
			
			Composite.add(engine.world, [blackHole, ball, rightBoard, leftBoard]);
			document.addEventListener('keyup', handlekeyUp);
			document.addEventListener('keydown', handleKeyDown);
			
			setInterval(() => {
				let randomX = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
				let randomY = Math.floor(Math.random() * (800 - 100 + 1)) + 100;
			  
				if (blackHole.position.x === 2000 && blackHole.position.y === 2000) {
				  Body.setPosition(blackHole, { x: randomX, y: randomY });
				} else {
				  Body.setPosition(blackHole, { x: 2000, y: 2000 });
				}
			}, 5000);
			
			setInterval(() => {
				if (ball.position.x < 30 || ball.position.x > 1670 || (ball.position.x === H / 2 && ball.position.y === W / 2)) {
					ball.render.opacity = 1;
				}
				else if (balckHoleCollision(ball, blackHole)) {
					ball.render.opacity = 0.15;
					setTimeout(() => {
						Body.setPosition(blackHole, { x: 2000, y: 2000 });
					}, 400);

					setTimeout(() => {
						ball.render.opacity = 1;
					}, 3000);
				}
			}, 20);

			Render.run(render);
			
			
			socket.on('sound', () => {
				const audio = new Audio('/game/space-sound.mp3');
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
			className="shadow-[0_20px_50px_rgba(_179,_54,_144,_1)]">
			</div>
		);
}
export default DisapGame;

