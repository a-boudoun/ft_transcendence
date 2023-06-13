"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events, Bodies, Composite} from "matter-js";
import { drawRect, drawCircle } from "@components/draw";

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

		const floor = drawRect(W / 2, H, 5000, 20, '#7AC7C4');
		const ceiling = drawRect(W / 2, 0, 5000, 20, '#7AC7C4');
		const rightBoard = drawRect(W - 35, H / 2, 25, 170, '#F73859');
		const leftBoard = drawRect(35, H / 2, 25, 170, '#F73859');
		const leftWall = drawRect(10, H / 2, 15, 5000, '#7AC7C4');
		const rightWall = drawRect(W - 10, H / 2, 15, 5000, '#7AC7C4');
		
		const ball = drawCircle(W / 2, H / 5, 20, '#384259');
		// Set the ball moving speed
		Composite.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		Body.setVelocity(ball, { x: 10, y: 5 });
		window.addEventListener("resize", handleResize);
		// document.addEventListener('keydown', handleKeyDown);
		
		Engine.run(engine);
		Render.run(render);
		// adding requestAnimationFrame to make the movement smoother
		// const delta = 1000 / 60;
		// const subSteps = 3;
		// const subDelta = delta / subSteps;

		// (function run() {
		//     window.requestAnimationFrame(run);
		//     for (let i = 0; i < subSteps; i += 1) {
		//       Engine.update(engine, subDelta);
		//     }
		// })();
		Events.on(engine, 'afterUpdate', () => {
			if (!divRef.current || ball.position.y < 0 || ball.position.y > divRef.current.clientHeight) return;
			Body.setPosition(
				rightBoard,
				{
					x: divRef.current.offsetWidth - 35,
					y: ball.position.y,
				}
			);
			Body.setPosition(
				leftBoard,
				{
					x: 35,
					y: ball.position.y,
				}
			);
		});
		return () => {
		  window.removeEventListener("resize", handleResize);
		//   document.removeEventListener('keydown', handleKeyDown);
		};
		}, []);

	return (
    <div className="flex justify-center items-center h-full w-full bg-[#384259]">
    <div
      ref={divRef}
      className="h-4/5 w-4/5">
      {/* Your content goes here */}
    </div>
  </div>
	);
}