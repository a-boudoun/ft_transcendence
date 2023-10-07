import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ghReq } from './game-history.controller';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
    @InjectRepository(User) private userRepo: Repository<User>,

  ) {}

  async create(ghReq: ghReq) {
    const gameHistory = this.gameHistoryRepo.create();
    gameHistory.winner = await this.userRepo.findOneBy({username: ghReq.winner})
    gameHistory.winner.XP += 10;
    gameHistory.loser = await this.userRepo.findOneBy({username: ghReq.loser})
    gameHistory.loserScore = ghReq.loserScore;
    return this.gameHistoryRepo.save(gameHistory);
  }

  findAll() {
    return this.gameHistoryRepo.find();
  }

  async getHistory(id: number) {
    const user = await this.userRepo.findOneBy({id});
    if (!user)
      return [];
    return this.gameHistoryRepo.find({where: [{winner: user}, {loser: user}], relations: ['winner', 'loser']});
  }
}
