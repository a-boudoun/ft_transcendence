import { Module } from "@nestjs/common";
import { gameService } from "./game.service";
import { GameGateway } from "./game.gateway";

@Module({
	providers: [gameService, GameGateway],
	exports: [gameService, GameGateway]
})
export class GameModule{}