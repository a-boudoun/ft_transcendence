import { Injectable } from "@nestjs/common";
import { Player } from "./interfaces/player.interface";

@Injectable()
export class gameService{
	private readonly players: Player[] = [];
	createPlayer(player: Player){
		player.id =  
		this.players.push(player);
	}
}