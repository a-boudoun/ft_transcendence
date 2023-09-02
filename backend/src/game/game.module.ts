import { Module } from "@nestjs/common";
import { gameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { engineService } from "./engine.service";
import { gameSimulation } from "./gameSimulation.service";

import { AuthModule } from "src/auth/auth.module";


@Module({
	imports: [AuthModule],
	providers: [gameService, GameGateway, engineService, gameSimulation],
	exports: [gameService, GameGateway, engineService]
})
export class GameModule{}