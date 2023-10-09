import { Controller, Get, Post, Body, Req, Param, UseGuards} from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard';

export class ghReq {
  winner: string;
  loser: string;
  loserScore: number;
}

@Controller('gameHistory')
@UseGuards(Jwt2faAuthGuard)
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post('')
  
  create(@Body() Body: any, @Req() Req) {
  
    const GameHistory: ghReq = {
      winner: Req.user.username,
      loser: Body.loser,
      loserScore: Body.loserScore
    }

    return this.gameHistoryService.create(GameHistory);
  }

  @Get('getHistory/:id')
  getHistory(@Param('id') id: number) {
    return this.gameHistoryService.getHistory(id);
  }
  
}
