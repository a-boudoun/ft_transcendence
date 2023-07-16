import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
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

  findOneByname(name: string) {
    const user = this.userRepo.findOneBy({name});

    return user;
  }

  
  async getDM(username: string) {
  const channels = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.channels', 'channel', 'channel.type = :type', {type: 'direct'}).where('user.username = :username', {username}).getMany();
  return channels;
  // return this.userRepo.findOne({where: {
    //   username: username,
    // }, relations: ['channels', 'channels.type']});
  }
  
  async getChannels(username: string) {
  const channels = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.channels', 'channel', 'channel.type != :type', {type: 'direct'}).where('user.username = :username', {username}).getMany();
  return channels;
  }
  async update(login: string, updateUser: UpdateUserDto) {
    const user = await this.findOne(login);
    return this.userRepo.save({...user, ...updateUser})
  }

  async remove(login: string) {
    const user = await this.findOne(login);
    return this.userRepo.remove(user);
  }

  async genarateToken(user: UserDTO) {
    const payload = {username: user.username, sub: user.XP};
    return this.jwtService.signAsync(payload);
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
