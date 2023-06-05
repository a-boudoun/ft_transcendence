"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";


export default function Home(){

	const canvasRef = useRef(null);


	useEffect(() => {
		let Engine = Matter.Engine,
			Render = Matter.Render,
			World = Matter.World,
			Bodies = Matter.Bodies;

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
		const floor = Bodies.rectangle(400, 600, 800, 20, {
			isStatic: true,
			render: {
			  fillStyle: '#4C3D3D'
			}
		  });

		const ceiling = Bodies.rectangle(400, 0, 800, 20, {
			isStatic: true,
			render: {
			  fillStyle: '#4C3D3D'
			}
		  });

		const rightBoard = Bodies.rectangle(750, 300, 20, 150, {
			isStatic: true,
			render: {
			  fillStyle: '#4C3D3D'
			}
		  });
		const leftBoard = Bodies.rectangle(50, 300, 20, 150, {
			isStatic: true,
			render: {
			  fillStyle: '#4C3D3D'
			}
		  });
		const leftWall = Bodies.rectangle(10, 300, 20, 560, {
			isStatic: true,
			render: {
			  fillStyle: '#7AC7C4'
			}
		  });
		const rightWall = Bodies.rectangle(790, 300, 20, 560, {
			isStatic: true,
			render: {
			  fillStyle: '#7AC7C4'
			}
		  });
		
		  const ball = Bodies.circle(300, 200, 13, {
			restitution: 1, // Make the ball fully elastic
    		friction: 0, // Remove friction
    		frictionAir: 0, // Remove air friction
			inertia: Infinity, // prevent ball from slowing down
			render: {
			  fillStyle: '#FFB26B'
			}
		  });
		  Matter.Body.setVelocity(ball, { x: 10, y: 5 }); // Set the ball moving speed
		
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