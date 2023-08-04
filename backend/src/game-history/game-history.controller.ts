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
