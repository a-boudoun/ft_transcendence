"use client";

import React, { useEffect, useRef } from "react";
import {Engine, Render, World, Body} from "matter-js";
import { drawRect, drawCircle } from "../utils/draw";

export default function Home(){
	
	const canvasRef = useRef(null);
	
	useEffect(() => {
		let engine = Engine.create({
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
					background: "#FF6000",
				}
			});

		const floor = drawRect(400, 600, 800, 20, '#4C3D3D');
		const ceiling = drawRect(400, 0, 800, 20, '#4C3D3D');
		const rightBoard = drawRect(750, 300, 20, 150, '#4C3D3D');
		const leftBoard = drawRect(50, 300, 20, 150, '#4C3D3D');
		const leftWall = drawRect(10, 300, 20, 560, '#7AC7C4');
		const rightWall = drawRect(790, 300, 20, 560, '#7AC7C4');
		
		const ball = drawCircle(300, 200, 15, '#FFB26B');
		Body.setVelocity(ball, { x: 15, y: 5 }); // Set the ball moving speed
		
		World.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		
		Engine.run(engine);
		Render.run(render);
	}, []);

	return (
		<div className="flex justify-center">
			<canvas ref={canvasRef}/>
		</div>
	);
}