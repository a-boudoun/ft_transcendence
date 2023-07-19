import { Module } from "@nestjs/common";
import { gameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { engineService } from "./engine.service";

@Module({
	providers: [gameService, GameGateway, engineService],
	exports: [gameService, GameGateway, engineService]
})
export class GameModule{}