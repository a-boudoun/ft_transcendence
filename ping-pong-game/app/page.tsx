"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {Engine, Render, World, Body, Mouse, MouseConstraint, Events} from "matter-js";
import { drawRect, drawCircle } from "@/utils/draw";

// TODO: implement the game logic in the backend and send the data to the frontend
// TODO: make the cnasvas responsive
// TODO: try the keyup keydown event to make the movement smoother

export default function Game(){
	let board: number = window.innerHeight / 2;
	const moveSpeed: number = 30;
	const canvasRef = useRef(null);
	const divRef = useRef(null);
	const timeToStart: number = 3;
	const [countDownValue, setCountDownValue] = useState<number>(timeToStart);
	const [pVisible, setPVisible] = useState<boolean>(true);
	const  [rightBoardY, setRightBoard] = useState<number>(board);
	const  [leftBoardY, setLeftBoard] = useState<number>(board);
	const  [renderRef, setRenderRef] = useState<Render>();
	const   [heightW, setHeightW] = useState<number>(window.innerHeight);
	const   [widthW, setWidthW] = useState<number>(window.innerWidth);

	const handleMouseMove = (event: any) => {
		const y = event.clientY;
		if (y > 85 && y < heightW - 85){
			setLeftBoard(y);
		}
	}

	const handlResize = () => {
		setHeightW(window.innerHeight);
		setWidthW(window.innerWidth);
	}
	const handlKeyDown = (event) => {
			// TODO: work with boardY instead of board
			if (event.key === "ArrowUp"){
				if (board - moveSpeed > 0){
					board -= moveSpeed;
				}
			}else if (event.key === "ArrowDown"){
				if (board + moveSpeed < heightW){
					board += moveSpeed;
				}
			}
			setRightBoard(board);
		};
	useEffect(() => {
		if (countDownValue <= 0) {
			setPVisible(false);
		}else{
			setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
		}
	}, [countDownValue]);
	
	useEffect(() => {
		const H = window.innerHeight;
		const W = window.innerWidth;
		if (!canvasRef.current) return;
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
			element: divRef.current,
			options: {
				width: W,
				height: H,
				// rendering pixel to be more sharp
				pixelRatio: 2,
				wireframes: false,
				background: "#7AC7C4",
			}
		});
		
		const floor = drawRect(W / 2, H, W, 20, '#92a7ad');
		const rightBoard = drawRect(W - 30, H / 2, 20, 150, '#EA5581');
		const ceiling = drawRect(W / 2, 0, W, 20, '#92a7ad');
		const leftBoard = drawRect(30, H / 2, 20, 150, '#EA5581');
		const leftWall = drawRect(10, H / 2, 15, H, '#91adcc');
		const rightWall = drawRect(W - 10, H / 2, 15, H, '#91adcc');
		
		const ball = drawCircle(W / 2, H / 5, 15, '#384259');
		// Set the ball moving speed
		World.add(engine.world, [floor, ball, ceiling, rightBoard, leftBoard, leftWall, rightWall]);
		const start =  () => {
			Body.setVelocity(ball, { x: 10, y: 5 });
			document.addEventListener("keydown", handlKeyDown);
			document.addEventListener("mousemove", handleMouseMove);
		}; 
		setRenderRef(render);
		window.addEventListener("resize", handlResize);
		setTimeout(start, timeToStart * 1000);
		setPVisible(true);
		setCountDownValue(timeToStart);
		
		
		Engine.run(engine);
		Render.run(render);
		// Remove event listener when component unmounts
		return () => {
		  document.removeEventListener("keydown", handleKeyDown);
		  document.removeEventListener("mousemove", handleMouseMove);
		};
		}, []);

		useEffect(() => {
			if (!renderRef) return;
			Body.setPosition(renderRef.engine.world.bodies[0], {x: widthW / 2, y: heightW});
			Body.setPosition(renderRef.engine.world.bodies[2], {x: widthW / 2, y: 0});
			Body.setPosition(renderRef.engine.world.bodies[5], {x: 10, y: heightW / 2});
			Body.setPosition(renderRef.engine.world.bodies[6], {x: widthW - 10, y: heightW / 2});
			Body.setPosition(renderRef.engine.world.bodies[3], {x: widthW - 30, y: rightBoardY});

		}, [heightW, widthW]);
		// useEffect(() => {
		// 	if (!renderRef) return;
		// 	Body.setPosition(renderRef.engine.world.bodies[3], {x: widthW - 30, y: rightBoardY});
		// } , [rightBoardY]);
		useEffect(() => {
			if (!renderRef) return;
			Events.on(renderRef.engine, 'afterUpdate', () => {
				const ballBody = renderRef.engine.world.bodies[1];
				Body.setPosition(renderRef.engine.world.bodies[3], { x: widthW - 30, y: ballBody.position.y });
			});
		  }, [renderRef]);

		useEffect(() => {
			if (!renderRef) return;
			Body.setPosition(renderRef.engine.world.bodies[4], {x: 30, y: leftBoardY});
		}, [leftBoardY]);

	return (
		<div className="h-screen" ref={divRef}>
			<canvas ref={canvasRef} className="cursor-none w-full h-full"/>
			{/* {pVisible && <p>{countDownValue}</p>} */}
		</div>
	);
}