import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';

@Module({
  controllers: [GameHistoryController],
  providers: [GameHistoryService]
})
export class GameHistoryModule {}
