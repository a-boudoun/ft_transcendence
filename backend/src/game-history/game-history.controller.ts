import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryDTO } from './dto/create-game-history.dto';


@Controller('gameHistory')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post()
  create(@Body() GameHistoryDTO: GameHistoryDTO) {
    return this.gameHistoryService.create(GameHistoryDTO);
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
