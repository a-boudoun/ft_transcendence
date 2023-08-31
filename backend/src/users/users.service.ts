import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity'
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import con from 'ormconfig';

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
    
    async findAll() {
      return await this.userRepo.find();
    }
   
    async search(key: string) {
      const users = await this.userRepo.findBy({name: Like(`%${key}%`)});
      return users;
  }
  
  findOne(username: string) {
    const user = this.userRepo.findOneBy({username});
    
    return user;
  }

  findonebyid(id: number) {
    return this.userRepo.findOne({
      where: {
        id: id,
      },
    });
  }


  findOneByname(name: string) {
    const user = this.userRepo.findOneBy({name});

    return user;
  }

  async isUserExist(myName: string,  name: string) {
    const user = await this.userRepo.findOneBy({name});

    if (user) {
      if (user.name === myName)
      {
        return false;
      }
      return true;
    }
    return false;
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

  async genarateToken(user: UserDTO, fact2Auth: boolean) {
    const payload = {username: user.username, sub: user.XP, fact2Auth: fact2Auth};
    return this.jwtService.signAsync(payload);
  }

  async set2FAsecret(secret: string, login: string) {
    const user = await this.findOne(login);
    return await this.userRepo.save({...user, ...{fact2Secret: secret}})
  }

  async turnON2FA(login: string) {
    const user = await this.findOne(login);
    await this.userRepo.update(user, { 
      fact2Auth : true
    });
  }


}
