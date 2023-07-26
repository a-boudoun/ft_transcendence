import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
// ! why import Matter like this?
import Matter = require("matter-js");
import { Room } from "./interfaces/room.interface";

@Injectable()
export class gameSimulation{

	//Engine
	private engine: Matter.Engine;
	private runner: Matter.Runner;
	private Cheight: number = 665;
	private Cwidth: number = 1019;
	//Bodies
	private floor: Matter.Body;
	private ceiling: Matter.Body;
	private rightBoard: Matter.Body;
	private leftBoard: Matter.Body;
	private leftWall: Matter.Body;
	private rightWall: Matter.Body;
	private ball: Matter.Body;

	private id: NodeJS.Timer;

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
		this.runner = Matter.Runner.create();
	}

	drawWorld() {
		this.floor = this.drawRect(this.Cwidth / 2, this.Cheight, 5000, 20);
		this.ceiling = this.drawRect(this.Cwidth / 2, 0, 5000, 20);
		this.rightBoard = this.drawRect(this.Cwidth - 35, this.Cheight / 2, 20, 120);
		this.leftBoard = this.drawRect(35, this.Cheight / 2, 20, 120);
		this.leftWall = this.drawRect(10, this.Cheight / 2, 15, 5000);
		this.rightWall = this.drawRect(this.Cwidth - 10, this.Cheight / 2, 15, 5000);
		this.ball = this.drawCircle(this.Cwidth / 2, this.Cheight / 2, 20);

		Matter.World.add(this.engine.world, [this.floor, this.ceiling, this.rightBoard, this.leftBoard, this.leftWall, this.rightWall, this.ball]);
		Matter.Body.setVelocity(this.ball, { x: 10, y: 5 });
	}
	
	setLeftBoardPosition(y : number) {
		Matter.Body.setPosition(this.leftBoard, 
			{ 
				x: 35,
				y: y,
			}
		);
	}

	setRightBoardPosition(y : number) {
		Matter.Body.setPosition(this.rightBoard, 
		{ 
			x: this.Cwidth - 35,
			y: y,
		}
		);
	}

	runEngine() {
		this.drawWorld();
		Matter.Runner.run(this.runner, this.engine);
	}

	stopEngine() {
		Matter.Engine.clear(this.engine);
		Matter.World.clear(this.engine.world, false);
		Matter.Runner.stop(this.runner);
		clearInterval(this.id);
	}

	// TODO: sent the positions normalized to the client
	sendPosition(room : Room) {
		this.id = setInterval(() => {
			room.players.forEach((player) => {
				player.socket.emit('ball', 
				{
					x: this.ball.position.x,
					y: this.ball.position.y,
				}
				);
				player.socket.emit('positions', 
				{
					leftBoardX: this.leftBoard.position.x,
					leftBoardY: this.leftBoard.position.y,
					rightBoardX: this.rightBoard.position.x,
					rightBoardY: this.rightBoard.position.y,
				}
				);
			});
		}, 15);
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
		);
	}
}