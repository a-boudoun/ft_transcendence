import { Injectable} from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Blockage, User } from '../entities/user.entity'
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isBlock } from 'typescript';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Blockage) private blockRepo: Repository<Blockage>,
    ) {}
    
    async block(bloker: any, blocked: any) {
      const block = await this.blockRepo.create();
      block.blocker = await this.findOne(bloker);
      block.blocked = await this.findOne(blocked);
      return this.blockRepo.save(block);
    }

    create(userDTO: UserDTO) {
      const user = this.userRepo.create(userDTO);
      return this.userRepo.save(user);
    }
    
    async findAll(username: string) {

      const allUsers =  await this.userRepo.find({
        order: {
          level: 'DESC',
        },
      });
      return  allUsers;

    }
    
    async search(username:string,  key: string) {
      const blockedUsers = await this.blockRepo.find({where: [{blocker : {username: username }}],  relations: ['blocked']});
      const blockedByUsers = await this.blockRepo.find({where: [{blocked : {username: username }}],  relations: ['blocker']});
      const blocked = blockedUsers.map(b => b.blocked);
      const blockedBy = blockedByUsers.map(b => b.blocker);
      const blockedAndBlocker = [...blocked, ...blockedBy];

      const allUsers = await this.userRepo.findBy({name: Like(`%${key}%`)});
      return  allUsers.filter(user => !blockedAndBlocker.some(b => b.username === user.username));

      // const blockedByUsers = await this.blockRepo.find({where: [{blocked : {username: username }}],  relations: ['blocker']});
      // const blocked = blockedByUsers.map(b => b.blocker);

      //  users = await this.userRepo.findBy({name: Like(`%${key}%`)});
    }
    
    findOne(username: string) {
      const user = this.userRepo.findOneBy({username});
      
      return user;
    }
    
    findOneByname(name: string) {
      const user = this.userRepo.findOneBy({name});
      
      return user;
    }
    
    async isNameExist(name: string) {
      const user = await this.userRepo.findOneBy({name});
      
      if (user) {
        return true;
      }
      return false;
    }

    async isBlocked(username: string, name: string) {
      const blockedUsers = await this.blockRepo.find({where: [{blocker : {username: username}}],  relations: ['blocked']});
      const blockedByUsers = await this.blockRepo.find({where: [{blocked : {username: username}}],  relations: ['blocker']});
      const blocked = blockedUsers.map(b => b.blocked);``
      const blockedBy = blockedByUsers.map(b => b.blocker);
      const blockedAndBlocker = [...blocked, ...blockedBy];

      const cnt = blockedAndBlocker.some(b => b.name === name);

      return cnt ? true : false;
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
        return await this.userRepo.save({...user, ...updateUser})
      }
      
      async remove(login: string) {
        const user = await this.findOne(login);
        return this.userRepo.remove(user);
      }
      
      async set2FAsecret(secret: string, login: string) {
        const user = await this.findOne(login);
        return await this.userRepo.save({...user, ...{fact2Secret: secret}})
      }
      
      async turnON2FA(username: string) {
        const user = await this.findOne(username);
        return await this.userRepo.save({...user, ...{fact2Auth: true}})
      }


    }