import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
// ! why import Matter like this?
import Matter = require("matter-js");
import { Room } from "./interfaces/room.interface";

@Injectable()
export class gameSimulation{

	//Engine
	private engine: Matter.Engine;
	// private runner: Matter.Runner;
	private Cheight: number = 890;
	private Cwidth: number = 2048;
	//Bodies
	private floor: Matter.Body;
	private ceiling: Matter.Body;
	private rightBoard: Matter.Body;
	private leftBoard: Matter.Body;
	private ball: Matter.Body;

	private id: NodeJS.Timer;
	private roomIn: Room;

	private rightScore: number = 0;
	private leftScore: number = 0;

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
		// this.runner = Matter.Runner.create({
		// });
	}

	drawWorld() {
		this.floor = this.drawRect(this.Cwidth / 2, this.Cheight, 5000, 20);
		this.ceiling = this.drawRect(this.Cwidth / 2, 0, 5000, 20);
		this.rightBoard = this.drawRect(this.Cwidth - 35, this.Cheight / 2, 20, 120);
		this.leftBoard = this.drawRect(35, this.Cheight / 2, 20, 120);
		this.ball = this.drawCircle(this.Cwidth / 2, this.Cheight / 2, 20);

		Matter.World.add(this.engine.world, [this.floor, this.ceiling, this.rightBoard, this.leftBoard, this.ball]);
		setTimeout(() => Matter.Body.setVelocity(this.ball, { x: 10, y: 5 }), 3000);
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
		this.detectCollision();
		this.restartGame();
		Matter.Engine.run(this.engine);
	}
	
	restartGame() {
		let vx : number;
		let vy: number;
		Matter.Events.on(this.engine, 'afterUpdate', () => {
			if (this.ball.position.x < 0 || this.ball.position.x > this.Cwidth) {
				if (this.ball.position.x < 0){
					this.rightScore++;
					vx = -10;
					vy = -3;
				}
				else{
					this.leftScore++;
					vx = 10;
					vy = 3;
				}
				this.roomIn.players.forEach((player) => {
					player.socket.emit('score', 
					{
						leftScore: this.leftScore,
						rightScore: this.rightScore,
					}
					);
				});
				// if (this.leftScore === 3 || this.rightScore === 3){
				// 	if (this.leftScore === 3){
				// 		this.roomIn.players.forEach((player) => {
				// 			player.socket.emit('winner', 'left');
				// 		});
				// 	}
				// 	else{
				// 		this.roomIn.players.forEach((player) => {
				// 			player.socket.emit('winner', 'right');
				// 		});
				// 	}
				// }
				Matter.Body.setPosition(this.ball, { x: this.Cwidth / 2, y: this.Cheight / 2 });
				Matter.Body.setVelocity(this.ball, { x: 0, y: 0 });

				setTimeout(() => Matter.Body.setVelocity(this.ball, { x: vx, y: vy }), 500);
			}
		});
	}
	
	detectCollision() {
		Matter.Events.on(this.engine, 'collisionStart', (event) => {
			this.handleCollision(event);
		});;
	}

	handleCollision(event: Matter.IEventCollision<Matter.Engine>): void {
		let pairs = event.pairs;
		let ballVelocity = this.ball.velocity;
		
		pairs.forEach((pair) => {
			if (pair.bodyA === this.leftBoard || pair.bodyB === this.leftBoard) {
				Matter.Body.setVelocity(this.ball, { 
					x: -20,
					y: ballVelocity.y 
				});
				this.roomIn.players.forEach((player) => {
					player.socket.emit('sound');
				});
			}
			else if (pair.bodyA === this.rightBoard || pair.bodyB === this.rightBoard) {
				Matter.Body.setVelocity(this.ball, { 
					x: 20, 
					y: ballVelocity.y
				});
				this.roomIn.players.forEach((player) => {
					player.socket.emit('sound');
				});
			}
		});
	}
	

	stopEngine() {
		Matter.Engine.clear(this.engine);
		Matter.World.clear(this.engine.world, false);
		Matter.Events.off(this.engine, 'collisionStart', this.handleCollision);
		clearInterval(this.id);
	}

	// stopRunner() {
	// 	Matter.Runner.stop(this.runner);
	// }

	// TODO: sent the positions normalized to the client
	sendPosition(room : Room) {
		this.roomIn = room;
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
				restitution: 0.9, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
			})
		);
	}
}