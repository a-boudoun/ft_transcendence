"use client";

import React, { useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body} from "matter-js";
import { drawRect, drawCircle } from "@/utils/draw";


export default function Game(){
	const canvasRef = useRef(null);
	const timeToStart: number = 3;
	const [countDownValue, setCountDownValue] = useState(timeToStart);
	const [pVisible, setPVisible] = useState(true);
	
	// to prevent infinite loop
	useEffect(() => {
		if (countDownValue <= 0) {
			setPVisible(false);
		}else{
			setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
		}
	}, [countDownValue]);

	useEffect(() => {
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

		const floor = drawRect(400, 600, 800, 20, '#7AC7C4');
		const ceiling = drawRect(400, 0, 800, 20, '#7AC7C4');
		const rightBoard = drawRect(750, 300, 20, 150, '#EA5581');
		const leftBoard = drawRect(50, 300, 20, 150, '#EA5581');
		const leftWall = drawRect(10, 300, 20, 560, '#7AC7C4');
		const rightWall = drawRect(790, 300, 20, 560, '#7AC7C4');
		
		const ball = drawCircle(400, 200, 15, '#384259');
		const start =  () => Body.setVelocity(ball, { x: 10, y: 5 }); // Set the ball moving speed
		setTimeout(start, timeToStart * 1000);
		//reset the timer
		setCountDownValue(3);
		setPVisible(true);
		
		World.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		
		Engine.run(engine);
		Render.run(render);
	}, []);

	return (
		<div className="flex justify-center relative">
			<canvas ref={canvasRef}/>
			{pVisible && <p className="absolute mt-4 font-bold text-white text-[50px]">{countDownValue}</p>}
		</div>
	);
}