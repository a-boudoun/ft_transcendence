"use client";

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body} from "matter-js";
import { drawRect, drawCircle } from "@/utils/draw";

export default function Game(){
	// let board: number = 300;
	const canvasRef = useRef(null);
	const timeToStart: number = 3;
	const [countDownValue, setCountDownValue] = useState<number>(timeToStart);
	const [pVisible, setPVisible] = useState<boolean>(true);
	const  [boardY, setBoard] = useState<number>(300);
	const  [renderRef, setRenderRef] = useState<Render>();
	
	// to prevent infinite loop
	const handleKeyDown = (event) => {
		console.log(event.key);
		if (event.key === "ArrowUp"){
			if (boardY > 0){
				setBoard(boardY - 10);
			}
		}else if (event.key === "ArrowDown"){
			if (boardY < 450){
				setBoard(boardY + 10);
			}
		}
	}

	useEffect(() => {
		if (countDownValue <= 0) {
			setPVisible(false);
		}else{
			setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
		}
	}, [countDownValue]);
	
	useEffect(() => {
	
		document.addEventListener("keydown", handleKeyDown);
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
			canvas: canvasRef.current,
			options: {
				width: 800,
				height: 600,
				// rendering pixel to be more sharp
				pixelRatio: 2,
				wireframes: false,
				background: "#7AC7C4",
			}
		});

		const floor = drawRect(400, 600, 800, 20, '#92a7ad');
		const rightBoard = drawRect(770, 300, 20, 150, '#EA5581');
		const ceiling = drawRect(400, 0, 800, 20, '#92a7ad');
		const leftBoard = drawRect(30, 300, 20, 150, '#EA5581');
		const leftWall = drawRect(10, 300, 15, 560, '#91adcc');
		const rightWall = drawRect(790, 300, 15, 560, '#91adcc');
		
		const ball = drawCircle(400, 200, 15, '#384259');
		const start =  () => Body.setVelocity(ball, { x: 8, y: 3 }); // Set the ball moving speed
		setTimeout(start, timeToStart * 1000);
		setPVisible(true);
		setCountDownValue(timeToStart);
		
		World.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		
		Engine.run(engine);
		Render.run(render);
		setRenderRef(render);
		// Remove event listener when component unmounts
		return () => {
		  document.removeEventListener("keydown", handleKeyDown);
		};
		}, []);

	return (
		<div className="flex justify-center relative mt-9">
			<canvas ref={canvasRef}/>
			<Rightb renderRef={renderRef} value={boardY}/>
			{pVisible && <p className="absolute mt-4 font-bold text-white text-[50px]">{countDownValue}</p>}
		</div>
	);
}