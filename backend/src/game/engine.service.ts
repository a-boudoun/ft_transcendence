import { Injectable } from "@nestjs/common";
import { gameSimulation } from "./gameSimulation.service";
import { gameService } from "./game.service";
import { Room } from "./interfaces/room.interface";

@Injectable()
export class engineService {
	private gameSimulations: Map<string, gameSimulation> = new Map<string, gameSimulation>();

	createGameSimulation(roomId: string) {
		const game: gameSimulation = new gameSimulation();
		this.gameSimulations.set(roomId, game);
		game.runEngine();
	}

	getGameSimulation(roomId: string): gameSimulation | undefined {
		return this.gameSimulations.get(roomId);
	}

	sendPosition(room: Room) {
		const game: gameSimulation | undefined = this.gameSimulations.get(room.id);
		if (game) {
			game.sendPosition(room);
		}
	}

	setLeftBoardPosition(roomId: string, y: number) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.setLeftBoardPosition(y);
		}
	}

	setRightBoardPosition(roomId: string, y: number) {
		const game: gameSimulation | undefined = this.gameSimulations.get(roomId);
		if (game) {
			game.setRightBoardPosition(y);
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