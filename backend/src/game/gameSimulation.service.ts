import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { engineService } from "./engine.service";
// ! why import Matter like this?
import Matter = require("matter-js");
import { Room } from "./interfaces/room.interface";
import { Player } from "./interfaces/player.interface";
import { GameHistory, User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "src/users/dto/create-user.dto";
import { GameHistoryService } from "src/game-history/game-history.service";
import { getRepository } from "typeorm";




@Injectable()
export class gameSimulation{

	//server
	private server: Server;
	//Engine
	private engine: Matter.Engine;
	private runner: Matter.Runner;
	private Cheight: number = 890;
	private Cwidth: number = 2048;
	//Bodies
	private floor: Matter.Body;
	private ceiling: Matter.Body;
	private rightBoard: Matter.Body;
	private leftBoard: Matter.Body;
	private ball: Matter.Body;
	// TODO : change any to the right type
	private id: any;
	private roomIn: Room;

	private rightScore: number = 0;
	private leftScore: number = 0;
	private leftName: string | string[];
	private rightName: string | string[];

	private won: string;
	private lost: string;
	private lostscore: number;

	private readonly MAX = 5;
	private readonly Bspeed = 10;

	private rightInt: any;
	private leftInt: any;

	constructor(
		// @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
		// @InjectRepository(User) private userRepo: Repository<User>,
	) {
		
		this.engine = Matter.Engine.create({
			enableSleeping: false, // Sleep the object when it is not moving
			constraintIterations: 4, // he higher quality the simulation will be at the expense of performance.
			gravity:{
				x:0,
				y:0,
				scale:0.01,
			},
		});
		this.runner = Matter.Runner.create({
		});
	}
	addServer(server: Server) {
		this.server = server;
	}

	drawWorld() {
		this.floor = this.drawRect(this.Cwidth / 2, this.Cheight, 5000, 20);
		this.ceiling = this.drawRect(this.Cwidth / 2, 0, 5000, 20);
		this.rightBoard = this.drawRect(this.Cwidth - 35, this.Cheight / 2, 20, 120);
		this.leftBoard = this.drawRect(35, this.Cheight / 2, 20, 120);
		this.ball = this.drawCircle(this.Cwidth / 2, this.Cheight / 2, 20);

		Matter.World.add(this.engine.world, [this.floor, this.ceiling, this.rightBoard, this.leftBoard, this.ball]);
		setTimeout(() => Matter.Body.setVelocity(this.ball, { x: 10, y: 5 }), 3900);
	}
	
	setLeftBoardPosition(direction : string) {
		let y : number;

		if (direction === 'stop')
			clearInterval(this.leftInt);
		else{
			this.leftInt = setInterval(() => {
				if (direction === 'ArrowUp')
					y = this.leftBoard.position.y - this.Bspeed;
				else
					y = this.leftBoard.position.y + this.Bspeed;
				if (y < 60 || y > this.Cheight - 60)
					return;
				Matter.Body.setPosition(this.leftBoard, 
					{ 
						x: 35,
						y: y,
					}
				);
			}, 15);
		}
	}

	setRightBoardPosition(direction : string) {
		let y : number;

		if (direction === 'stop')
			clearInterval(this.rightInt);
		else{
			this.rightInt = setInterval(() => {
				if (direction === 'ArrowUp')
					y = this.rightBoard.position.y - this.Bspeed;
				else
					y = this.rightBoard.position.y + this.Bspeed;
				if (y < 60 || y > this.Cheight - 60)
				return;
			Matter.Body.setPosition(this.rightBoard, 
				{ 
					x: this.Cwidth - 35,
					y: y,
				}
				);
			}, 15);
		}
	}
	
	runEngine() {
		this.drawWorld();
		this.detectCollision();
		this.restartGame();
		Matter.Runner.run(this.runner, this.engine);
	}
	
	stopEngine() {
		Matter.Engine.clear(this.engine);
		Matter.World.clear(this.engine.world, false);
		Matter.Events.off(this.engine, 'collisionStart', this.handleCollision);
		Matter.Runner.stop(this.runner);
		clearInterval(this.id);
	}

	async saveGameScore() {
		const userRepo = await getRepository(User);
		const gameHistoryRepo = await getRepository(GameHistory);
		const gameHistory = await gameHistoryRepo.create();
		const winner = await userRepo.findOneBy({username: this.won});
		const loser = await userRepo.findOneBy({username: this.lost});
		gameHistory.winner = winner;
		gameHistory.loser = loser;
		gameHistory.loserScore = this.lostscore;
		await gameHistoryRepo.save(gameHistory);
		// if (this.won === this.leftName.toString())
		// 	this.server.to(this.roomIn.id).emit('winner', 'left');
		// else
		// 	this.server.to(this.roomIn.id).emit('winner', 'right');
		// stop the game here
	}

	restartGame() {
		let vx : number;
		let vy: number;
		Matter.Events.on(this.engine, 'afterUpdate', () => {
			if (this.ball.position.x < 0 || this.ball.position.x > this.Cwidth) {
				if (this.ball.position.x < 0 && this.leftScore <= this.MAX && this.rightScore <= this.MAX){
					this.rightScore++;
					vx = -10;
					vy = -3;
				}
				else if (this.rightScore <= this.MAX && this.leftScore <= this.MAX){
					this.leftScore++;
					vx = 10;
					vy = 3;
				}
				if (this.leftScore >= this.MAX || this.rightScore >= this.MAX){
					if (this.leftScore >= this.MAX){
						this.server.to(this.roomIn.id).emit('winner', 'left');
						this.won = this.leftName.toString();
						this.lost = this.rightName.toString();
						this.lostscore = this.rightScore;
					}
					else{
						this.server.to(this.roomIn.id).emit('winner', 'right');
						this.won = this.rightName.toString();
						this.lost = this.leftName.toString();
						this.lostscore = this.leftScore;
					}
					// this.saveGameScore();
				}
			
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
				this.server.to(this.roomIn.id).emit('sound');
			}
			else if (pair.bodyA === this.rightBoard || pair.bodyB === this.rightBoard) {
				Matter.Body.setVelocity(this.ball, { 
					x: 20, 
					y: ballVelocity.y
				});
				this.server.to(this.roomIn.id).emit('sound');
			}
		});
	}

	sendPosition(room : Room) {
		this.roomIn = room;
		this.leftName = room.players[0].position === 'left' ? room.players[0].username : room.players[1].username;
		this.rightName = room.players[0].position === 'right' ? room.players[0].username : room.players[1].username;
		this.id = setInterval(() => {
			this.server.to(room.id).emit('ball', 
			{
				x: this.ball.position.x,
				y: this.ball.position.y,
			}
			);
			this.server.to(room.id).emit('positions', 
			{
				leftBoardX: this.leftBoard.position.x,
				leftBoardY: this.leftBoard.position.y,
				rightBoardX: this.rightBoard.position.x,
				rightBoardY: this.rightBoard.position.y,
			}
			);
			this.server.to(this.roomIn.id).emit('score', 
				{
					leftScore: this.leftScore,
					rightScore: this.rightScore,
				}
			);
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
