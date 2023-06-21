import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/create-datum.dto';
import { Administration, Blockage, Channel, Friendship, 
  GameHistory, Membership, Message, Sanction, 
  User } from './entities/datum.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
  
@Injectable()
export class DataService {
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

  create(userDTO: UserDTO) {
    const user = this.userRepo.create(userDTO);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(login: string) {
    return this.userRepo.findOneBy({ login });
  }

  // update(id: number, updateDatumDto: UpdateDatumDto) {
  //   return `This action updates a #${id} datum`;
  // }

  async remove(login: string) {
    const user = await this.findOne(login);
    return this.userRepo.remove(user);
  }

  getFriends(login: string) {
    const user = this.userRepo.find({
      where: {
        login: login,
      },
      relations: {
        initiatedFriendships: true,
        receivedFriendships: true,
      }
    })
  }
}
