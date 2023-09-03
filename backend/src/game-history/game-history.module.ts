import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { Blockage, GameHistory, User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistory, User, Blockage])],
  controllers: [GameHistoryController],
  providers: [GameHistoryService, UsersService]
})
export class GameHistoryModule {}
