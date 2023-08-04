import { Injectable } from '@nestjs/common';
import { GameHistoryDTO } from './dto/create-game-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/users/dto/create-user.dto';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory) private gameHistoryRepo: Repository<GameHistory>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  create(GameHistoryDto: GameHistoryDTO) {
    const gameHistory = this.gameHistoryRepo.create(GameHistoryDto);
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
