import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administration, Blockage, Channel, ChannelType, Friendship, GameHistory, Membership, Message, Sanction, Status, User } from './user.entity';
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
    const ceo1 = this.userRepo.create({pseudo: "homid", XP:0, status: Status.ONLINE, fact2Auth: false, level: 1});
    await this.userRepo.save(ceo1);
    const ceo2 = this.userRepo.create({pseudo: "hamid", XP:0, status: Status.ONLINE, fact2Auth: false, level: 1});
    await this.userRepo.save(ceo2);
    const ch1 = this.channelRepo.create({name: "jazira1", type: ChannelType.DIRECT, owner: ceo1, password: "1337"});
    await this.channelRepo.save(ch1);
    const ch2 = this.channelRepo.create({name: "jazira2", type: ChannelType.DIRECT, owner: ceo2, password: "1337"});
    await this.channelRepo.save(ch2);
    ceo1.channels = [ch1, ch2];
    await this.userRepo.save(ceo1);
    const mem1 = this.membershipRepo.create({channel: ch1, member: ceo1});
    const mem2 = this.membershipRepo.create({channel: ch1, member: ceo2});
    await this.membershipRepo.save(mem1);
    await this.membershipRepo.save(mem2);
  }
  
  getHello(): any {
    return ([{'name': 'Hello World!'}]);
  }
}
