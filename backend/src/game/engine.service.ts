import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";
import Matter = require("matter-js");

@Injectable()
export class engineService {
	//Engine
	private engine: Matter.Engine;
	private Cheight: number = 700;
	private Cwidth: number = 1000;
	//Bodies
	private floor: Matter.Body;
	private ceiling: Matter.Body;
	private rightBoard: Matter.Body;
	private leftBoard: Matter.Body;
	private leftWall: Matter.Body;
	private rightWall: Matter.Body;
	private ball: Matter.Body;

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

	drawWorld() {
		this.floor = this.drawRect(this.Cwidth/ 2, this.Cheight, 5000, 20);
		this.ceiling = this.drawRect(this.Cwidth/ 2, 0, 5000, 20);
		this.rightBoard = this.drawRect(this.Cwidth- 35, this.Cheight/ 2, 20, 120);
		this.leftBoard = this.drawRect(35, this.Cheight/ 2, 20, 120);
		this.leftWall = this.drawRect(10, this.Cheight/ 2, 15, 5000);
		this.rightWall = this.drawRect(this.Cwidth- 10, this.Cheight/ 2, 15, 5000);
		this.ball = this.drawCircle(this.Cwidth/ 2, this.Cheight/ 2, 20);

		Matter.World.add(this.engine.world, [this.floor, this.ceiling, this.rightBoard, this.leftBoard, this.leftWall, this.rightWall, this.ball]);
	}
	
	runEngine() {
		this.drawWorld();
		Matter.Engine.run(this.engine);
		Matter.Body.setVelocity(this.ball, { x: 10, y: 5 });
	}
	// ! This function is for debugging purposes only
	printBallPosition() {
		Matter.Events.on(this.engine, 'afterUpdate', () => {
			console.log('Ball position X, Y: ', this.ball.position.x, this.ball.position.y);
		});
	}

	sendBallPosition(room : Room) {
		Matter.Events.on(this.engine, 'afterUpdate', () => {
			room.players.forEach((player) => {
				player.socket.emit('ball', 
				{
					x: this.ball.position.x / this.Cwidth,
					y: this.ball.position.y/ this.Cheight,
				}
			);
			});
		});
	}

	drawRect(x : number, y : number, w : number, h : number) {
		return (
			Matter.Bodies.rectangle(x, y, w, h, {
				isStatic: true,
				chamfer: { radius: 10 },
			})
			)
		}
		
	drawCircle(x : number, y : number, r : number) {
		return (
			Matter.Bodies.circle(x, y, r, {
				restitution: 1, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
			})
		)
	}
}