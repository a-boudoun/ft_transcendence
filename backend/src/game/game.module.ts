import { Module } from "@nestjs/common";
import { gameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { engineService } from "./engine.service";
import { gameSimulation } from "./gameSimulation.service";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameHistory, User } from "src/entities/user.entity";
import { UsersGateway } from '../usersGateway/user.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([GameHistory, User])],
	providers: [gameService, GameGateway, engineService, gameSimulation, UsersGateway, JwtService],
	exports: [gameService, GameGateway, engineService]
})
export class GameModule{}
