import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Administration, Blockage, Channel, Friendship, 
  GameHistory, Membership, Message, Sanction, 
  User } from './entities/user.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    // @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    // @InjectRepository(Message) private messageRepo: Repository<Message>,
    // @InjectRepository(GameHistory) private gamehistoryRepo: Repository<GameHistory>,
    // @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
    // @InjectRepository(Sanction) private sanctionRepo: Repository<Sanction>,
    // @InjectRepository(Membership) private membershipRepo: Repository<Membership>,
    // @InjectRepository(Blockage) private blockageRepo: Repository<Blockage>,
    // @InjectRepository(Administration) private administrationRepo: Repository<Administration>,
    ) {}

  create(userDTO: UserDTO) {
    const user = this.userRepo.create(userDTO);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(username: string) {
    const user = this.userRepo.findOneBy({username});

    return user;
  }

  async update(login: string, updateUser: UpdateUserDto) {
    const user = await this.findOne(login);
    return this.userRepo.save({...user, ...updateUser})
  }

  async remove(login: string) {
    const user = await this.findOne(login);
    return this.userRepo.remove(user);
  }
  // getFriends(login: string) {
  //   const user = this.userRepo.find({
  //     where: {
  //       login: login,
  //     },
  //     relations: {
  //       initiatedFriendships: true,
  //       receivedFriendships: true,
  //     }
  //   })
  // }
}
