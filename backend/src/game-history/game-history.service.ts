import { Injectable } from '@nestjs/common';
import { GameHistoryDTO } from './dto/create-game-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { ghReq } from './game-history.controller';
@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async create(ghReq: ghReq) {
    const gameHistory = this.gameHistoryRepo.create();
    gameHistory.winner = await this.userRepo.findOne({where: {username: ghReq.winner}});
    gameHistory.winner.XP += 10;
    await this.userRepo.save(gameHistory.winner);
    gameHistory.loser = await this.userRepo.findOne({where: {username: ghReq.loser}});
    gameHistory.loserScore = ghReq.loserScore;
    return this.gameHistoryRepo.save(gameHistory);
  }

  findAll() {
    return this.gameHistoryRepo.find();
  }

  async findOne(username: string) {
    const user = await this.userRepo.find({where: {username: username}});
    return this.gameHistoryRepo.find({where: [{winner: user}, {loser: user}]});
  }

  // update(id: number, updateGameHistoryDTO: UpdateGameHistoryDto) {
  //   return `This action updates a #${id} gameHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} gameHistory`;
  // }
}
