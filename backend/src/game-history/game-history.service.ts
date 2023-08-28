import { Injectable } from '@nestjs/common';
import { GameHistoryDTO } from './dto/create-game-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ghReq } from './game-history.controller';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
    // @InjectRepository(User) private userRepo: Repository<User>, 
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

  async findOne(name: string) {
    const user = await this.userService.findOneByname(name);
    return this.gameHistoryRepo.find({where: [{winner: user}, {loser: user}], relations: ['winner', 'loser']});
  }

  // update(id: number, updateGameHistoryDTO: UpdateGameHistoryDto) {
  //   return `This action updates a #${id} gameHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} gameHistory`;
  // }
}
