
'use client';

import React, { use, useEffect, useRef } from "react";
import { drawCircle, drawRect } from "@utils/draw";

import Matter from "matter-js";

export default function Game(){

	const divRef = useRef<HTMLDivElement>(null);


	useEffect(() => {
		if (!divRef.current) return;

		var Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Bodies = Matter.Bodies,
		Composite = Matter.Composite;


	var engine = Engine.create();


	var render = Render.create({
		element: divRef.current,
		engine: engine,
		options: {
			width: divRef.current.offsetWidth,
			height: divRef.current.offsetHeight,
			wireframes: false,
			pixelRatio: 1,
			background: "grey",
		}
	});


	const leftWall = drawRect(
		15,
		divRef.current.offsetHeight / 2,
		10,
		5000,
		'green'
	);
	const rightWall = drawRect(
		divRef.current.offsetWidth  - 15,
		divRef.current.offsetHeight / 2,
		10,
		5000,
		'green',
	);
	const ground = drawRect(
		divRef.current.offsetWidth / 2,
		divRef.current.offsetHeight - 10,
		5000,
		10,
		'green',
	);
	const ceiling = drawRect(
		divRef.current.offsetWidth / 2,
		10,
		5000,
		10,
		'green',
	);
	

	Composite.add(engine.world, [leftWall, rightWall, ground, ceiling]);

	Render.run(render);

	var runner = Runner.create();

	Runner.run(runner, engine);

	window.addEventListener("resize", () => {

		if (!divRef.current) return;
		render.canvas.width = divRef.current.offsetWidth;

		Matter.Body.setPosition(rightWall,
			{
			x: divRef.current.offsetWidth - 15,
			y: divRef.current.offsetHeight / 2,
			}
		);

	});

	}, []);

	return (
		<div className="bg-black/[.5] h-screen w-screen">
			<div
				ref={divRef}
				className="h-full w-full bg-[#2C3333]">

			</div>
		</div>
	)
}