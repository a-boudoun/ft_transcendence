import { Injectable } from "@nestjs/common";
import { gameSimulation } from "./gameSimulation.service";
import { Room } from "./interfaces/room.interface";
import { Server } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { GameHistory, Status, User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { UsersGateway } from "src/usersGateway/user.gateway";

@Injectable()
export class engineService {
	constructor(
		@InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
		@InjectRepository(User) private userRepo: Repository<User>,
		private usersGateway: UsersGateway,
	) { }
	
	private gameSimulations: Map<string, gameSimulation> = new Map<string, gameSimulation>();

	async createGameSimulation(room: Room) {
		const userA = await this.userRepo.findOneBy({id: +room.players[0].username});
		const userB = await this.userRepo.findOneBy({id: +room.players[1].username});

		userA.status = Status.INGAME;
		userB.status = Status.INGAME;
		this.usersGateway.updeteUser(userA.id);
		this.usersGateway.updeteUser(userB.id);
		await this.userRepo.save(userA);
		await this.userRepo.save(userB);
		const game: gameSimulation = new gameSimulation();
		this.gameSimulations.set(room.id, game);
		game.runEngine();
	}
	
	sendPosition(room: Room, endGameSimulation: (roomId: string) => void) {
		const game: gameSimulation | undefined = this.gameSimulations.get(room.id);
		if (game) {
			game.sendPosition(room, endGameSimulation);
		}
	}
	
	addServerToGame(roomId: string, server: Server) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.addServer(server);
		}
	}
	
	setLeftBoardPosition(roomId: string, direction: string) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.setLeftBoardPosition(direction);
		}
	}
	
	setRightBoardPosition(roomId: string, direction: string) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.setRightBoardPosition(direction);
		}
	}
	
	setLoser(roomId: string, loser: string) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.setLoser(loser);
		}
	}

	async removeGameSimulation(roomId: string) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.stopEngine();
			const gameHistory = await this.gameHistoryRepo.create();
			const winner = await this.userRepo.findOneBy({id: +game.getWinner()});
			winner.wins += 1;
			winner.XP += Math.round(winner.level > 0 ? (100 / winner.level) : 100);
			winner.level = Math.sqrt(winner.XP) * 0.075;
			winner.status = Status.ONLINE;
			const loser = await this.userRepo.findOneBy({id: +game.getLoser()});
			loser.loses += 1;
			loser.XP += Math.round(loser.XP > 10 ? (-10 * loser.level) : (-loser.XP));
			loser.level = Math.sqrt(loser.XP) * 0.075;
			loser.status = Status.ONLINE;
			gameHistory.winner = winner;
			gameHistory.loser = loser;
			gameHistory.loserScore = game.getLoserScore();
			await this.gameHistoryRepo.save(gameHistory);
			await this.userRepo.save(winner);
			await this.userRepo.save(loser);
			this.gameSimulations.delete(roomId);
			this.usersGateway.updeteUser(loser.id);
			this.usersGateway.updeteUser(winner.id);
			}
		}
	}