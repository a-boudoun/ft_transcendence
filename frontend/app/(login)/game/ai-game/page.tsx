"use client";

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, Body, Events, Composite} from "matter-js";
import PlayersScore from "@/components/game/score";
import Won from "@/components/game/winner";
import Lost from "@/components/game/loser";
import { drawRect, drawCircle } from "@/components/game/draw";
import { useRouter } from "next/navigation";

export default function Game(){
	const divRef = useRef<HTMLDivElement | null>(null);
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	const [Winner, setWinner] = useState<string>('');
	const [Loser, setLoser] = useState<string>('');
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	let keyClicked : boolean = false;
	let moveLeft : boolean = false;
	let leftInterval : number;
	let interval : number;

	useEffect(() => {
			const handleResize = () => {
				if (!divRef.current) return;
					render.canvas.width = divRef.current.offsetWidth;
					render.canvas.height = divRef.current.offsetHeight;
					Body.setPosition(
						rightBoard,
						{
							x: divRef.current.offsetWidth - 35,
							y: divRef.current.offsetHeight / 2,
						}
					);
					Body.setPosition(
						leftBoard,
						{
							x: 35,
							y: divRef.current.offsetHeight / 2,
						}
					);
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

			const handleKeyDown = (e: KeyboardEvent) => {
				if (!keyClicked)
				{
					if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
						keyClicked = true;
						interval = setInterval(() => {
							if (e.key === 'ArrowUp' && rightBoard.position.y > 80){
								Body.setPosition(rightBoard,
									{
										x: rightBoard.position.x,
										y: rightBoard.position.y - 10,
									})
							}
							else if (e.key === 'ArrowDown' && rightBoard.position.y < divRef.current.offsetHeight - 80){
								Body.setPosition(rightBoard,
									{
										x: rightBoard.position.x,
										y: rightBoard.position.y + 10,
									})
							}
						}, 15);

					}
				}
			}

			const handlekeyUp = (e: KeyboardEvent) => {
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
					keyClicked = false;
					clearInterval(interval);
				}
			}

			
			if (!divRef.current) return;
			
			const H = divRef.current.offsetHeight;
			const W = divRef.current.offsetWidth;
			
			let engine = Engine.create({
				enableSleeping: false, // Sleep the object when it is not moving
				constraintIterations: 4, // he higher quality the simulation will be at the expense of performance.
				gravity:{
					x:0,
					y:0,
					scale:0.1,
				},
			}),
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
			});
			
			const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#FFFFFF');
			const leftBoard = drawRect(35, H / 2, 20, 120, '#FFFFFF');
			const ball = drawCircle(W / 2, H / 2, 15, '#FFFFFF');
			const floor = drawRect(W / 2, H, 5000, 20, '#000000');
			const ceiling = drawRect(W / 2, 0, 5000, 20, '#000000');
			
			function handleLeftBoard(): void {
				leftInterval = setInterval(() => {
					if (ball.position.y < leftBoard.position.y - 10 && leftBoard.position.y > 80){
						Body.setPosition(leftBoard,
							{
								x: leftBoard.position.x,
								y: leftBoard.position.y - 5,
							});
					}
					else if (ball.position.y > leftBoard.position.y + 10 && leftBoard.position.y < divRef.current.offsetHeight - 80){
						Body.setPosition(leftBoard,
							{
								x: leftBoard.position.x,
								y: leftBoard.position.y + 5,
							});
					}

				}, 10);
			}

			function handleCollision(event: any): void {
				let pairs = event.pairs;
				let ballVelocity = ball.velocity;
				
				pairs.forEach((pair) => {
					if (pair.bodyA === leftBoard || pair.bodyB === leftBoard) {
						moveLeft = false;
						clearInterval(leftInterval);
						Body.setVelocity(ball, { 
							x: -15,
							y: ballVelocity.y 
						});
					}
					else if (pair.bodyA === rightBoard || pair.bodyB === rightBoard) {
						moveLeft = true;
						clearInterval(leftInterval);
						handleLeftBoard();
						Body.setVelocity(ball, { 
							x: 15, 
							y: ballVelocity.y
						});
					}
				});
			}

			function resetPosition(): void {
				let vx: number;
				let vy: number;

				if (ball.position.x < 0 || ball.position.x > divRef.current.offsetWidth) {
					if (ball.position.x < 0) {
						moveLeft = true;
						clearInterval(leftInterval);
						handleLeftBoard();
						setRightScore(rightScore + 1);
						vx = -8;
						vy = -4;
					}
					else {
						moveLeft = false;
						clearInterval(leftInterval);
						setLeftScore(leftScore + 1);
						vx = 8;
						vy = 4;
					}

					if (rightScore === 5) {
						setWinner('aboudoun');
					}
					else if (leftScore === 5) {
						setLoser('aboudoun');
					}

					Body.setPosition(ball, {x: divRef.current.offsetWidth / 2, y: divRef.current.offsetHeight / 2});
					Body.setVelocity(ball, {x: 0, y: 0});
					setTimeout(() => {
						Body.setVelocity(ball, {x: vx, y: vy});
					}, 500);
				}
			}

			Composite.add(engine.world, [ball, rightBoard, leftBoard, floor, ceiling]);
			Body.setVelocity(ball, {x: 0, y: 0});
			window.addEventListener("resize", handleResize);
			document.addEventListener('keyup', handlekeyUp);
			document.addEventListener('keydown', handleKeyDown);
			
			setTimeout(() => {
				Body.setVelocity(ball, {x: 8, y: 4});
			}, 3000);

			Events.on(engine, 'collisionStart', (event) => {
				handleCollision(event);
			});

			Events.on(engine, 'beforeUpdate', () => {
				resetPosition();
			});

			Engine.run(engine);
			Render.run(render);

			return () => {
				window.removeEventListener("resize", handleResize);
				document.removeEventListener('keyup', handlekeyUp);
				document.removeEventListener('keydown', handleKeyDown);
				Engine.clear(engine);
				Render.stop(render);
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
	<>
		{Winner === '' && Loser === '' && <div className="flex justify-center  items-center h-full w-full bg-[#384259]">
			{(PVisible && !leftScore && !rightScore) && <p className="absolute font-bold text-[#ffffff] text-[90px] mb-[150px] ">{countDownValue}</p>}
			<PlayersScore 
			left={leftScore} 
			right={rightScore}
			leftPlayer={'aboudoun'}
			rightPlayer={'aboudoun'}
			/>
			<div
			ref={divRef}
			className="h-4/6 w-4/5 mt-20 cursor-none">
			</div>
			<button 
				className="absolute bottom-[50px] right-[50px]  m-4  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]" 
				onClick={() => {
					router.push("/home");
				}}>
				leave
			</button>
		</div>}
		{Winner !== '' && <Won winner={Winner}/>}
		{Loser !== '' && <Lost loser={Loser}/>}
	</>
	);
}