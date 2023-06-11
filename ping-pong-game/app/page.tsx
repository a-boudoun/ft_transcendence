"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events, Bodies, Composite} from "matter-js";
import { drawRect, drawCircle } from "@/utils/draw";

//// : implement the game logic in the backend and send the data to the frontend
//// : make the cnasvas responsive
//// : try the keyup keydown event to make the movement smoother

export default function Game(){
	const divRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		if (!divRef.current) return;
		
		const H = divRef.current.offsetHeight;
		const W = divRef.current.offsetWidth;
		
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
			element: divRef.current,
			options: {
				width: W,
				height: H,
				// rendering pixel to be more sharp
				pixelRatio: 1,
				wireframes: false,
				background: "grey",
			}
		});		
		const handleResize = () => {
			if (!divRef.current) return;
			const divH = divRef.current.offsetHeight;
			const divW = divRef.current.offsetWidth;
			console.log("div", divRef.current.offsetWidth, divRef.current.offsetHeight);
			// render.canvas.height = divH;
			// render.canvas.width = divW;
			console.log("canvas", render.canvas.width, render.canvas.height);
			console.log("window", window.innerWidth, window.innerHeight);
			render.canvas.style.background = "white";

			Body.setPosition(engine.world.bodies[0], {x: divW / 2, y: divH});
			Body.setPosition(engine.world.bodies[2], {x: divW / 2, y: 0});

			console.log(Body);
			Body.setPosition(engine.world.bodies[5], {x: 10, y: divH / 2});
			Body.setPosition(engine.world.bodies[6], {x: divW - 20, y: divH / 2});
			Body.setPosition(engine.world.bodies[3], {x: divW - 30, y: divH / 2});
		}

		const floor = drawRect(W / 2, H, W, 20, 'transparent');
		const rightBoard = drawRect(W - 30, H / 2, 20, 150, '#EA5581');
		const ceiling = drawRect(W / 2, 0, W, 20, 'transparent');
		const leftBoard = drawRect(30, H / 2, 20, 150, '#EA5581');
		const leftWall = Bodies.rectangle(0, H / 2, 15, H, {isStatic: true,});
		const rightWall = drawRect(W - 10, H / 2, 15, H, 'red');
		
		const ball = drawCircle(W / 2, H / 5, 15, '#384259');
		// Set the ball moving speed
		Composite.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		Body.setVelocity(ball, { x: 10, y: 5 });
		window.addEventListener("resize", 
			() => {

				if (!divRef.current) return;

				render.canvas.width = divRef.current.offsetWidth;


				Body.setPosition(
					leftWall,
					{
						x: 0,
						y: divRef.current.offsetHeight / 2
					}
				);
				


				// Body.setPosition(engine.world.bodies[6], {x: divRef.current.offsetWidth - 20, y: divRef.current.offsetHeight / 2});
			}
		);
		
		
		
		Engine.run(engine);
		Render.run(render);
		// Remove event listener when component unmounts
		// return () => {
		//   window.removeEventListener("resize", handleResize);
		// };
		}, []);

	return (
		<div ref={divRef} className="h-[600px] w-[900px] bg-[#7AC7C4]">
			{/* <canvas className="cursor-none fixed top-0 left-0"/> */}
		</div>
	);
}