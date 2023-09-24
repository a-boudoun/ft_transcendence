"use client";

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, Body, Events, Composite} from "matter-js";
import PlayersScore from "@/components/game/score";
import Won from "@/components/game/winner";
import Lost from "@/components/game/loser";
import { drawRect, drawCircle } from "@/components/game/draw";
import { useRouter } from "next/navigation";

function RobotGame({difficulty} : {difficulty: number}){
	const divRef = useRef<HTMLDivElement | null>(null);
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	var lScore = 0;
	var rScore = 0;
	let keyClicked : boolean = false;;
	let maxScore = 5;
	let leftInterval : NodeJS.Timeout;
	let keyInterval : NodeJS.Timeout;
	const maxScore = 5;

	useEffect(() => {
		if (!divRef.current) return;
			
		let H = divRef.current.offsetHeight;
		let W = divRef.current.offsetWidth;

		const handleResize = () => {
			if (!divRef.current) return;
				render.canvas.width = divRef.current.offsetWidth;
				render.canvas.height = divRef.current.offsetHeight;
				H = divRef.current.offsetHeight;
				W = divRef.current.offsetWidth;
				Body.setPosition(
					rightBoard,
					{
						x: W - 35,
						y: H / 2,
					}
				);
				Body.setPosition(
					leftBoard,
					{
						x: 35,
						y: H / 2,
					}
				);
				Body.setPosition(
					floor,
					{
						x: W / 2,
						y: H,
					}
				);
				Body.setPosition(
					ceiling,
					{
						x: W / 2,
						y: 0,
					}
				);
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!keyClicked)
			{
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
					keyClicked = true;
					keyInterval = setInterval(() => {
						if (e.key === 'ArrowUp' && rightBoard.position.y > 80){
							Body.setPosition(rightBoard,
								{
									x: rightBoard.position.x,
									y: rightBoard.position.y - 10,
								})
						}
						else if (e.key === 'ArrowDown' && rightBoard.position.y < H - 80){
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
				keyClicked = false;
				clearInterval(keyInterval);
		}
		
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
				else if (ball.position.y > leftBoard.position.y + 10 && leftBoard.position.y < H - 80){
					Body.setPosition(leftBoard,
						{
							x: leftBoard.position.x,
							y: leftBoard.position.y + 5,
						});
				}

			}, difficulty);
		}

		function handleCollision(event: any): void {
			let pairs = event.pairs;
			let ballVelocity = ball.velocity;
			let audio = new Audio('/game/bounce.mp3');

			pairs.forEach((pair: any) => {
				if (pair.bodyA === leftBoard || pair.bodyB === leftBoard) {
					clearInterval(leftInterval);
					Body.setVelocity(ball, { 
						x: -15,
						y: ballVelocity.y 
					});
					audio.play();
				}
				else if (pair.bodyA === rightBoard || pair.bodyB === rightBoard) {
					clearInterval(leftInterval);
					handleLeftBoard();
					Body.setVelocity(ball, { 
						x: 15, 
						y: ballVelocity.y
					});
					audio.play();
				}
			});
		}

		function resetPosition(): void {
			if (lScore === maxScore || rScore === maxScore)
				return;
			let vx: number;
			let vy: number;

			if (ball.position.x < 0 || ball.position.x > W) {
				if (ball.position.x < 0) {
					clearInterval(leftInterval);
					handleLeftBoard();
					rScore++;
					setRightScore((prevScore) => prevScore + 1);
					vx = -8;
					vy = -4;
				}
				else {
					clearInterval(leftInterval);
					setLeftScore((prevScore) => prevScore + 1);
					lScore++;
					vx = 8;
					vy = 4;
				}
				if (lScore === maxScore || rScore === maxScore)
				{
					Events.off(engine, 'beforeUpdate', resetPosition);
					Events.off(engine, 'collisionStart', handleCollision);
					window.removeEventListener("resize", handleResize);
					document.removeEventListener('keyup', handlekeyUp);
					document.removeEventListener('keydown', handleKeyDown);
					Engine.clear(engine);
					Render.stop(render);
					return;
				}

				Body.setPosition(ball, {x: W / 2, y: H / 2});
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
			Events.off(engine, 'collisionStart', handleCollision);
			Events.off(engine, 'beforeUpdate', resetPosition);
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
		{ leftScore < maxScore && rightScore < maxScore && <div className="flex justify-center  items-center h-full w-full bg-[#384259]">
			{(PVisible && !leftScore && !rightScore) && <p className="absolute font-bold text-[#ffffff] text-[90px] mb-[150px] ">{countDownValue}</p>}
			<PlayersScore 
			left={leftScore} 
			right={rightScore}
			leftPlayer={"robot"}
			rightPlayer={"me"}
			/>
			<div
			ref={divRef}
			className="h-4/6 w-4/5 mt-20"
			>
			</div>
			<button 
				className="absolute bottom-[50px] right-[50px]  m-4  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]" 
				onClick={() => {
					router.push("/home");
				}}>
				leave
			</button>
		</div>}
		{rightScore >= maxScore && <Won/>}
		{leftScore >=  maxScore && <Lost/>}
	</>
	);
}

export default RobotGame;