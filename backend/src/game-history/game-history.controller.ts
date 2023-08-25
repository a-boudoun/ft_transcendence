import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryDTO } from './dto/create-game-history.dto';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import con from 'ormconfig';

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

  @Get()
  findAll() {
    return this.gameHistoryService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.gameHistoryService.findOne(username);
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
