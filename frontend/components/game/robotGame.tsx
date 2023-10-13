"use client";

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, Bodies, Body, Events, Composite, Runner} from "matter-js";
import PlayersScore from "@/components/game/score";
import WonOffline from "@/components/game/winnerOffline";
import LostOffline from "@/components/game/loserOffline";
import { drawRect } from "@/components/game/draw";
import { useRouter } from "next/navigation";

function RobotGame({difficulty} : {difficulty: number}){
	const divRef = useRef<HTMLDivElement | null>(null);
	const [PVisible, setPVisible] = useState<boolean>(true);
	const router = useRouter();
	const [countDownValue, setCountDownValue] = useState<number>(3);
	const [leftScore, setLeftScore] = useState<number>(0);
	const [rightScore, setRightScore] = useState<number>(0);
	const [sx, setSx] = useState<number>(1);
	const [sy, setSy] = useState<number>(1);
	var lScore = 0;
	var rScore = 0;
	let keyClicked : boolean = false;;
	let leftInterval : NodeJS.Timeout;
	let keyInterval : NodeJS.Timeout;
	const maxScore = 5;

	useEffect(() => {
		if (!divRef.current) return;
			
		let H = 900;
		let W = 1700;

	
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
					}, 17);
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
				scale:0.01,
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
				background: "/game/default.png",
			}
		}),
		runner = Runner.create();

		
		const rightBoard = drawRect(W - 35, H / 2, 20, 120, '#FFFFFF');
		const leftBoard = drawRect(35, H / 2, 20, 120, '#FFFFFF');
		const floor = drawRect(W / 2, H, 5000, 20, '#000000');
		const ceiling = drawRect(W / 2, 0, 5000, 20, '#000000');
		
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
						x: -20,
						y: ballVelocity.y 
					});
					audio.play();
				}
				else if (pair.bodyA === rightBoard || pair.bodyB === rightBoard) {
					clearInterval(leftInterval);
					handleLeftBoard();
					Body.setVelocity(ball, { 
						x: 20, 
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
					vx = -10;
					vy = -4;
				}
				else {
					clearInterval(leftInterval);
					setLeftScore((prevScore) => prevScore + 1);
					lScore++;
					vx = 10;
					vy = 4;
				}
				if (lScore === maxScore || rScore === maxScore)
				{
					Events.off(engine, 'beforeUpdate', resetPosition);
					Events.off(engine, 'collisionStart', handleCollision);
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
		document.addEventListener('keyup', handlekeyUp);
		document.addEventListener('keydown', handleKeyDown);
		
		setTimeout(() => {
			Body.setVelocity(ball, {x: 10, y: 5});
		}, 3000);

		Events.on(engine, 'collisionStart', (event) => {
			handleCollision(event);
		});

		Events.on(engine, 'beforeUpdate', () => {
			resetPosition();
		});

		Runner.run(runner, engine);
		Render.run(render);

		return () => {
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

	  useEffect(() => {
		let canvasWidth: number = 1750;
		let canvasHeight: number = 1200;
		
		let windowWidth: number = window.innerWidth;
		let windowHeight: number = window.innerHeight;
		
		let scaleFactor: number = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
		
		let scalex: number = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
		let scaley: number = scaleFactor > 0.95 ? 1 : scaleFactor * 0.85; // adding the navbar height
		setSx(scalex);
		setSy(scaley);
		window.addEventListener("resize", handleResize);
		
		function handleResize(){
		  windowWidth = window.innerWidth;
		  windowHeight = window.innerHeight;
		  scaleFactor = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
		  scalex = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
		  scaley = scaleFactor > 1 ? 1 : scaleFactor * 0.85; // adding the navbar height
		  setSx(scalex);
		  setSy(scaley);
		}
		
		return () => {
		  window.removeEventListener("resize", handleResize);
		}
		}, []);

		
	  return (
		<>
			{(leftScore < maxScore && rightScore < maxScore) && (
				<div className="flex flex-col h-full justify-center items-center relative overflow-hidden">
				<div className="relative flex-grow">
					<div className="mt-12 pt-12"
						style={{
							transform: `scale(${sx}, ${sy})`,
							transformOrigin: 'center',
						}}
					>
						<PlayersScore
						left={leftScore}
						right={rightScore}
						leftPlayer={"robot"}
						rightPlayer={"me"}
						/>
					</div>
						<div className="flex justify-center items-center mt-10 z-20">
							{PVisible && !leftScore && !rightScore && (
							<p className="absolute font-bold text-[#ffffff] text-[90px] mb-[150px] z-20">
								{countDownValue}
							</p>
							)}
						</div>
					<div
					ref={divRef}
					className="mt-20 shadow-[0px_20px_50px_0px_#86c3bb,0px_-10px_50px_0px_#d3455c]"
					style={{
						transform: `scale(${sx}, ${sy})`,
						transformOrigin: 'center',
					}}
					></div>
				</div>
				<button
					className="absolute bottom-10 right-10 text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]"
					onClick={() => {
					router.push("/game");
					}}
				>
					Leave
				</button>
				</div>
			)}
			{rightScore >= maxScore && <WonOffline />}
			{leftScore >= maxScore && <LostOffline />}
		</>

	  );
	  
}

export default RobotGame;