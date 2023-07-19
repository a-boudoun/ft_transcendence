import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import Matter = require("matter-js");

@Injectable()
export class engineService {
	private engine: Matter.Engine;
	private world: Matter.World;
	private ball: Matter.Body;

	constructor() {
		this.engine = Matter.Engine.create();
		this.world = this.engine.world;
		this.ball = Matter.Bodies.circle(400, 200, 20);
		Matter.World.add(this.world, this.ball);
	}
}