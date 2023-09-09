import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ghReq } from './game-history.controller';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
    private userService: UsersService,
  ) {}

  async create(ghReq: ghReq) {
    const gameHistory = this.gameHistoryRepo.create();
    gameHistory.winner = await this.userService.findOne(ghReq.winner);
    gameHistory.winner.XP += 10;
    gameHistory.loser = await this.userService.findOne(ghReq.loser);
    gameHistory.loserScore = ghReq.loserScore;
    return this.gameHistoryRepo.save(gameHistory);
  }

  findAll() {
    return this.gameHistoryRepo.find();
  }

  async getHistory(username: string) {
    const user = await this.userService.findOne(username);
    if (!user)
      return [];
    return this.gameHistoryRepo.find({where: [{winner: user}, {loser: user}], relations: ['winner', 'loser']});
  }
}
