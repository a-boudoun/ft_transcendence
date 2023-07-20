import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import Matter = require("matter-js");

@Injectable()
export class engineService {
	private engine: Matter.Engine;
	private runner: Matter.Runner;
	private Cheight: number = 700;
	private Cwidth: number = 1000;

	constructor() {
		this.engine = Matter.Engine.create({
			enableSleeping: false, // Sleep the object when it is not moving
			constraintIterations: 4, // he higher quality the simulation will be at the expense of performance.
			gravity:{
				x:0,
				y:0,
				scale:0.001,
			},
		});
	}

}