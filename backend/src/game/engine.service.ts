import { Injectable } from "@nestjs/common";
import { gameSimulation } from "./gameSimulation.service";
import { Room } from "./interfaces/room.interface";
import { Server } from "socket.io";

@Injectable()
export class engineService {
	private gameSimulations: Map<string, gameSimulation> = new Map<string, gameSimulation>();

	createGameSimulation(roomId: string) {
		const game: gameSimulation = new gameSimulation();
		this.gameSimulations.set(roomId, game);
		game.runEngine();
	}

	sendPosition(room: Room) {
		const game: gameSimulation | undefined = this.gameSimulations.get(room.id);
		if (game) {
			game.sendPosition(room);
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

	removeGameSimulation(roomId: string) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.stopEngine();
			this.gameSimulations.delete(roomId);
		}
	}
}