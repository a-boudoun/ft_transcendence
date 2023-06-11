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

		const handleResize = () => {
			if (!divRef.current) return;

				render.canvas.width = divRef.current.offsetWidth;
				render.canvas.height = divRef.current.offsetHeight;


				Body.setPosition(
					leftWall,
					{
						x: 10,
						y: divRef.current.offsetHeight / 2
					}
				);
				Body.setPosition(
					rightWall,
					{
						x: divRef.current.offsetWidth - 10,
						y: divRef.current.offsetHeight / 2,
					}
				);
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
				background: "#7AC7C4",
			}
		});

		const floor = drawRect(W / 2, H, 5000, 20, '#5B4B8A');
		const rightBoard = drawRect(W - 35, H / 2, 20, 150, '#F73859');
		const ceiling = drawRect(W / 2, 0, 5000, 20, '#5B4B8A');
		const leftBoard = drawRect(35, H / 2, 20, 150, '#F73859');
		const leftWall = drawRect(10, H / 2, 15, 5000, '#C4EDDE');
		const rightWall = drawRect(W - 10, H / 2, 15, 5000, '#C4EDDE');
		
		const ball = drawCircle(W / 2, H / 5, 15, '#384259');
		// Set the ball moving speed
		Composite.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		Body.setVelocity(ball, { x: 20, y: 5 });
		window.addEventListener("resize", handleResize);
		
		
		
		Engine.run(engine);
		Render.run(render);
		return () => {
		  window.removeEventListener("resize", handleResize);
		};
		}, []);

	return (
		<div className="bg-black/[.5] h-screen w-screen">
		<div
			ref={divRef}
			className="h-full w-full bg-[#2C3333]">

		</div>
	</div>
	);
}