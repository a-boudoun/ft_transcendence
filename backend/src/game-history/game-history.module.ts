import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { GameHistory, User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersGateway } from 'src/usersGateway/user.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistory, User])],
  controllers: [GameHistoryController],
  providers: [GameHistoryService, UsersGateway, JwtService],
})
export class GameHistoryModule {}
