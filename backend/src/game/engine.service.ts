import { Injectable } from "@nestjs/common";
import { gameSimulation } from "./gameSimulation.service";
import { Room } from "./interfaces/room.interface";
import { Server } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { GameHistory, User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { getRepository } from "typeorm";



@Injectable()
export class engineService {
	constructor(
		@InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }
	
	private gameSimulations: Map<string, gameSimulation> = new Map<string, gameSimulation>();

	createGameSimulation(roomId: string) {
		const game: gameSimulation = new gameSimulation();
		this.gameSimulations.set(roomId, game);
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
			const winner = await this.userRepo.findOneBy({username: game.getWinner()});
			const loser = await this.userRepo.findOneBy({username: game.getLoser()});
			gameHistory.winner = winner;
			gameHistory.loser = loser;
			gameHistory.loserScore = game.getLoserScore();
			await this.gameHistoryRepo.save(gameHistory);
			this.gameSimulations.delete(roomId);
			}

		}
	}