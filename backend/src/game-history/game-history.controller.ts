import { Controller, Get, Post, Body, Req, Param, UseGuards} from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard';

export class ghReq {
  winner: string;
  loser: string;
  loserScore: number;
}

@Controller('gameHistory')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post('')
  @UseGuards(Jwt2faAuthGuard)
  create(@Body() Body: any, @Req() Req) {
  
    const GameHistory: ghReq = {
      winner: Req.user.username,
      loser: Body.loser,
      loserScore: Body.loserScore
    }

    return this.gameHistoryService.create(GameHistory);
  }

  @Get('getHistory/me')
  @UseGuards(Jwt2faAuthGuard)
  getMyHistory(@Req() req) {
    return this.gameHistoryService.findOne(req.user.username);
  }

  @Get('getHistory/:name')
  @UseGuards(Jwt2faAuthGuard)
  getHistory(@Param('name') name: string) {
    return this.gameHistoryService.findOne(name);
  }
  

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGameHistoryDto: UpdateGameHistoryDto) {
  //   return this.gameHistoryService.update(+id, updateGameHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gameHistoryService.remove(+id);
  // }
}
