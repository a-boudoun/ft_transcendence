import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administration, Blockage, Channel, Friendship, GameHistory, Membership, Message, Sanction, Status, User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
  @InjectRepository(User) private userRepo: Repository<User>,
  @InjectRepository(Channel) private channelRepo: Repository<Channel>,
  @InjectRepository(Message) private messageRepo: Repository<Message>,
  @InjectRepository(GameHistory) private gamehistoryRepo: Repository<GameHistory>,
  @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
  @InjectRepository(Sanction) private sanctionRepo: Repository<Sanction>,
  @InjectRepository(Membership) private membershipRepo: Repository<Membership>,
  @InjectRepository(Blockage) private blockageRepo: Repository<Blockage>,
  @InjectRepository(Administration) private administrationRepo: Repository<Administration>,
  ) {}

  async seed() {
    const ceo = this.userRepo.create({pseudo: "homid", XP:0, status: Status.ONLINE, fact2Auth: false, level: 1});
    await this.userRepo.save(ceo);
  }
  
  getHello(): any {
    return ([{'name': 'Hello World!'}]);
  }
}
