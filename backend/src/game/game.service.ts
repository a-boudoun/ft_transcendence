import { Injectable } from "@nestjs/common";
import { Player } from "./interfaces/player.interface";

@Injectable()
export class gameService{
	private players: Player[] = [];
	createPlayer(player: Player){
		this.players.push(player);
	}
// Todo: create a room service to match two players

// Todo: create a matchmaking service
  private matchmakingQueue: string[] = [];

  addPlayerToQueue(playerId: string) {
    this.matchmakingQueue.push(playerId);
  }

  matchPlayers(): { player1: string, player2: string } | null {
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      return { player1, player2 };
    }
    return null;
  }
}